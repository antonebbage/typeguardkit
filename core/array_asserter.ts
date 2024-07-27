// This module is browser-compatible.

import { Asserted } from "./asserted.ts";
import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `ArrayAsserterOptions` are passed to the `ArrayAsserter` constructor. */
export interface ArrayAsserterOptions<Element> {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly mustBeASet?: boolean;
  readonly rules?: ReadonlyArray<ArrayAsserterRule<Element>>;
}

/**
 * `ArrayAsserterRule`s can be assigned to the `ArrayAsserterOptions` `rules`
 * property.
 */
export interface ArrayAsserterRule<Element> {
  readonly validate: (value: Element[]) => boolean;
  readonly requirements: readonly string[];
}

/**
 *  An `ArrayAsserter` is an `Asserter` for the `Array` type defined by its
 * `elementAsserter`, with any additional validation defined by its
 * `ArrayAsserterOptions` properties.
 *
 * The `minLength` and `maxLength` `ArrayAsserterOptions` can be used to set the
 * minimum and maximum number of elements allowed.
 *
 * If `mustBeASet` is set to `true`, each element must be unique (objects are
 * deeply compared).
 *
 * The `rules` option can be used to specify `validate` functions and their
 * `requirements`. Each `validate` function should return `true` if `value` is
 * valid according to the rule, and `false` otherwise. `requirements` must not
 * be empty or contain any blank `string`s.
 *
 * The provided `memberAsserter` and `ArrayAsserterOptions` are made accessible
 * as properties of the created `ArrayAsserter`.
 *
 * The `array` function can be used to create an `ArrayAsserter` without
 * specifying a `typeName` or `ArrayAsserterOptions`.
 *
 * Example:
 *
 * ```ts
 * import { _number, _string, ArrayAsserter, Asserted } from "../mod.ts";
 *
 * export const _NonEmptyArrayOfString = new ArrayAsserter(
 *   "NonEmptyArrayOfString",
 *   _string,
 *   { minLength: 1 },
 * );
 *
 * export type NonEmptyArrayOfString = Asserted<typeof _NonEmptyArrayOfString>;
 *
 * export const _ArraySetOfString = new ArrayAsserter(
 *   "ArraySetOfString",
 *   _string,
 *   { mustBeASet: true },
 * );
 *
 * export type ArraySetOfString = Asserted<typeof _ArraySetOfString>;
 *
 * export const _AscendingArrayOfNumber = new ArrayAsserter(
 *   "AscendingArrayOfNumber",
 *   _number,
 *   {
 *     rules: [
 *       {
 *         validate(value) {
 *           for (let i = 1; i < value.length; i++) {
 *             if (value[i - 1] > value[i]) {
 *               return false;
 *             }
 *           }
 *
 *           return true;
 *         },
 *
 *         requirements: ["must be in ascending order"],
 *       },
 *     ],
 *   },
 * );
 *
 * export type AscendingArrayOfNumber = Asserted<
 *   typeof _AscendingArrayOfNumber
 * >;
 * ```
 */
export class ArrayAsserter<ElementAsserter extends Asserter<unknown>>
  implements Asserter<Array<Asserted<ElementAsserter>>> {
  readonly typeName: string;

  readonly minLength: number | null;
  readonly maxLength: number | null;
  readonly mustBeASet: boolean;
  readonly rules: ReadonlyArray<ArrayAsserterRule<Asserted<ElementAsserter>>>;

  constructor(
    typeName: string,
    readonly elementAsserter: ElementAsserter,
    { minLength, maxLength, mustBeASet = false, rules }: ArrayAsserterOptions<
      Asserted<ElementAsserter>
    >,
  ) {
    if (
      minLength !== undefined && (minLength < 1 || !Number.isInteger(minLength))
    ) {
      throw new Error("`minLength` must be a positive integer if defined");
    }

    if (
      maxLength !== undefined && (maxLength < 1 || !Number.isInteger(maxLength))
    ) {
      throw new Error("`maxLength` must be a positive integer if defined");
    }

    if (
      minLength !== undefined && maxLength !== undefined &&
      minLength > maxLength
    ) {
      throw new Error("`minLength` must be <= `maxLength` if both are defined");
    }

    if (rules) {
      for (const { requirements } of rules) {
        if (
          (!requirements.length ||
            requirements.some((requirement) => /^\s*$/.test(requirement)))
        ) {
          throw new Error(
            "rule `requirements` must not be empty or contain any blank `string`s",
          );
        }
      }
    }

    this.typeName = typeName || "UnnamedArray";

    this.minLength = minLength ?? null;
    this.maxLength = maxLength ?? null;
    this.mustBeASet = mustBeASet;
    this.rules = rules ?? [];
  }

  assert(
    value: unknown,
    valueName?: string,
  ): Array<Asserted<ElementAsserter>> {
    if (!Array.isArray(value)) {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues: Array<string | TypeAssertionError> = [];

    for (let i = 0; i < value.length; i++) {
      try {
        this.elementAsserter.assert(value[i], `${i}`);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    const minLength = this.minLength;
    const maxLength = this.maxLength;

    if (
      minLength !== null && minLength === maxLength &&
      value.length !== minLength
    ) {
      issues.push(`must have ${minLength}`);
    } else if (minLength !== null && value.length < minLength) {
      issues.push(`must have a minimum of ${minLength}`);
    } else if (maxLength !== null && value.length > maxLength) {
      issues.push(`must have a maximum of ${maxLength}`);
    }

    if (this.mustBeASet && !ArrayAsserter.#checkArrayIsASet(value)) {
      issues.push("must not have duplicates");
    }

    for (const { validate, requirements } of this.rules) {
      if (!validate(value)) {
        issues.push(...requirements);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    return value;
  }

  static #checkArrayIsASet(value: unknown[]): boolean {
    for (let i = 0; i < value.length; i++) {
      for (let j = i + 1; j < value.length; j++) {
        if (
          typeof value[i] === "object" && value[i] !== null &&
          typeof value[j] === "object" && value[j] !== null
        ) {
          if (
            ArrayAsserter.#checkObjectsEqual(
              value[i] as Record<string, unknown>,
              value[j] as Record<string, unknown>,
            )
          ) {
            return false;
          }
        } else if (value[i] === value[j]) {
          return false;
        }
      }
    }

    return true;
  }

  static #checkObjectsEqual(
    a: Record<string, unknown>,
    b: Record<string, unknown>,
  ): boolean {
    for (const key in a) {
      if (
        typeof a[key] === "object" && a[key] !== null &&
        typeof b[key] === "object" && b[key] !== null
      ) {
        if (
          !ArrayAsserter.#checkObjectsEqual(
            a[key] as Record<string, unknown>,
            b[key] as Record<string, unknown>,
          )
        ) {
          return false;
        }
      } else if (a[key] !== b[key]) {
        return false;
      }
    }

    for (const key in b) {
      if (!(key in a)) {
        return false;
      }
    }

    return true;
  }
}
