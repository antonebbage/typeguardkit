// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `ArrayAsserterOptions` are passed to the `ArrayAsserter` constructor. */
export interface ArrayAsserterOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
}

/**
 *  An `ArrayAsserter` is an `Asserter` for the `Array` type defined by its
 * `elementAsserter`, with any additional validation defined by its
 * `ArrayAsserterOptions` properties.
 *
 * The `minLength` and `maxLength` `ArrayAsserterOptions` can be used to set the
 * minimum and maximum number of elements allowed.
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

  constructor(
    typeName: string,
    readonly elementAsserter: Asserter<Element>,
    { minLength, maxLength }: ArrayAsserterOptions,
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
}
