// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const stringAsserterTypeName = "StringAsserter" as const;

/**
 * A `StringAsserter` is an `Asserter<string>` with any additional validation
 * defined by its `StringAsserterOptions` properties.
 */
export interface StringAsserter
  extends Asserter<string>, StringAsserterOptions {
  readonly asserterTypeName: typeof stringAsserterTypeName;
}

/** `StringAsserterOptions` can be passed to the `stringAsserter` function. */
export interface StringAsserterOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly validate?: (value: string) => string[];
}

/**
 * `stringAsserter` returns a `StringAsserter` that asserts whether `value` is
 * of type `string` and valid according to the provided `StringAsserterOptions`.
 *
 * The `minLength` and `maxLength` `StringAsserterOptions` can be used to set
 * the minimum and maximum number of characters (as UTF-16 code units) allowed.
 *
 * If defined, the `StringAsserterOptions` `validate` function should return an
 * empty array if `value` is valid, or an array of issues if `value` is invalid.
 *
 * The provided `StringAsserterOptions` are made accessible as properties of the
 * returned `StringAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { stringAsserter } from "./mod.ts";
 *
 * export const _NonEmptyString = stringAsserter(
 *   "NonEmptyString",
 *   { minLength: 1 },
 * );
 * ```
 */
export function stringAsserter(
  assertedTypeName: string,
  { minLength, maxLength, validate }: StringAsserterOptions,
): StringAsserter {
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

  assertedTypeName ||= "UnnamedString";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "string") {
      throw new TypeAssertionError(assertedTypeName, value, {
        valueName,
        issues: "must be of type `string`",
      });
    }

    const issues: string[] = [];

    if (minLength !== undefined && value.length < minLength) {
      issues.push(`must have a minimum of ${minLength} characters`);
    }

    if (maxLength !== undefined && value.length > maxLength) {
      issues.push(`must have a maximum of ${maxLength} characters`);
    }

    if (validate) {
      issues.push(...validate(value));
    }

    if (issues.length) {
      throw new TypeAssertionError(assertedTypeName, value, {
        valueName,
        issues,
      });
    }

    return value;
  };

  asserter.asserterTypeName = stringAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  asserter.minLength = minLength;
  asserter.maxLength = maxLength;
  asserter.validate = validate;

  return asserter;
}
