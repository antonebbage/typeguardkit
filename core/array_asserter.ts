// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `ArrayAsserterOptions` are passed to the `ArrayAsserter` constructor. */
export interface ArrayAsserterOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly mustBeASet?: boolean;
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
 * The provided `memberAsserter` and `ArrayAsserterOptions` are made accessible
 * as properties of the created `ArrayAsserter`.
 *
 * The `array` function can be used to create an `ArrayAsserter` without
 * specifying a `typeName` or `ArrayAsserterOptions`.
 *
 * Example:
 *
 * ```ts
 * import { _string, ArrayAsserter } from "../mod.ts";
 *
 * export const _NonEmptyArrayOfString = new ArrayAsserter(
 *   "NonEmptyArrayOfString",
 *   _string,
 *   { minLength: 1 },
 * );
 *
 * export type NonEmptyArrayOfString = ReturnType<
 *   typeof _NonEmptyArrayOfString.assert
 * >;
 * ```
 */
export class ArrayAsserter<Element>
  implements Asserter<Element[]>, ArrayAsserterOptions {
  readonly typeName: string;

  readonly minLength?: number;
  readonly maxLength?: number;
  readonly mustBeASet: boolean;

  constructor(
    typeName: string,
    readonly elementAsserter: Asserter<Element>,
    { minLength, maxLength, mustBeASet = false }: ArrayAsserterOptions,
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

    this.typeName = typeName || "UnnamedArray";

    this.minLength = minLength;
    this.maxLength = maxLength;
    this.mustBeASet = mustBeASet;
  }

  assert(value: unknown, valueName?: string): Element[] {
    if (!Array.isArray(value)) {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues: Array<string | TypeAssertionError> = [];

    const minLength = this.minLength;
    const maxLength = this.maxLength;

    if (
      minLength !== undefined && minLength === maxLength &&
      value.length !== minLength
    ) {
      issues.push(`must have ${minLength}`);
    } else if (minLength !== undefined && value.length < minLength) {
      issues.push(`must have a minimum of ${minLength}`);
    } else if (maxLength !== undefined && value.length > maxLength) {
      issues.push(`must have a maximum of ${maxLength}`);
    }

    if (this.mustBeASet && !ArrayAsserter.#checkArrayIsASet(value)) {
      issues.push("must be a set");
    }

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
