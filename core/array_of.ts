// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const arrayAsserterTypeName = "ArrayAsserter" as const;

/**
 * An `ArrayAsserter` is an `Asserter` for the array type defined by its
 * `elementAsserter` with any additional validation defined by its
 * `ArrayAsserterOptions` properties.
 */
export interface ArrayAsserter<Element>
  extends Asserter<Array<Element>>, ArrayAsserterOptions {
  readonly asserterTypeName: typeof arrayAsserterTypeName;

  readonly elementAsserter: Asserter<Element>;
}

/** `ArrayAsserterOptions` can be passed to the `arrayOf` function. */
export interface ArrayAsserterOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
}

/**
 * `arrayOf` returns an `ArrayAsserter<Element>` that asserts whether `value` is
 * of type `Array<Element>` and valid according to any provided
 * `ArrayAsserterOptions`.
 *
 * The `minLength` and `maxLength` `ArrayAsserterOptions` can be used to set the
 * minimum and maximum number of elements allowed.
 *
 * The provided `ArrayAsserterOptions` are made accessible as properties of the
 * returned `ArrayAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { _string, arrayOf } from "../mod.ts";
 *
 * const _ArrayOfString = arrayOf(_string);
 *
 * export const _NonEmptyArrayOfString = arrayOf(
 *   _string,
 *   { minLength: 1 },
 *   "NonEmptyArrayOfString",
 * );
 * ```
 */
export function arrayOf<Element>(
  elementAsserter: Asserter<Element>,
  { minLength, maxLength }: ArrayAsserterOptions = {},
  arrayTypeName?: string,
): ArrayAsserter<Element> {
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

  const definedArrayTypeName = arrayTypeName ||
    `Array<${elementAsserter.assertedTypeName}>`;

  const arrayAsserter = (value: unknown, valueName?: string) => {
    if (!Array.isArray(value)) {
      throw new TypeAssertionError(definedArrayTypeName, value, { valueName });
    }

    const issues: Array<string | TypeAssertionError> = [];

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
        elementAsserter(value[i], `${i}`);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(definedArrayTypeName, value, {
        valueName,
        issues,
      });
    }

    return value;
  };

  arrayAsserter.asserterTypeName = arrayAsserterTypeName;
  arrayAsserter.assertedTypeName = definedArrayTypeName;

  arrayAsserter.elementAsserter = elementAsserter;
  arrayAsserter.minLength = minLength;
  arrayAsserter.maxLength = maxLength;

  return arrayAsserter;
}
