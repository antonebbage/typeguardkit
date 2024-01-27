// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAsserter, typeAsserterTypeName } from "./type_asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `ArrayOfOptions` can be passed to the `arrayOf` function. */
export interface ArrayOfOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
}

/**
 * `arrayOf` returns a `TypeAsserter<Array<Type>>`, created using the provided
 * `Asserter<Type>`, that asserts whether `value` is of type `Array<Type>` and
 * valid according to any provided `ArrayOfOptions`.
 *
 * The `minLength` and `maxLength` `ArrayOfOptions` can be used to set the
 * minimum and maximum number of elements allowed.
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
export function arrayOf<Type>(
  elementAsserter: Asserter<Type>,
  { minLength, maxLength }: ArrayOfOptions = {},
  arrayTypeName?: string,
): TypeAsserter<Array<Type>> {
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

  arrayAsserter.asserterTypeName = typeAsserterTypeName;
  arrayAsserter.assertedTypeName = definedArrayTypeName;

  return arrayAsserter;
}
