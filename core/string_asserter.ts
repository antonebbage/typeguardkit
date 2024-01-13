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
  readonly regex?: StringAsserterRegex;
  readonly validate?: (value: string) => string[];
}

/**
 * A `StringAsserterRegex` can be assigned to the `StringAsserterOptions`
 * `regex` property.
 */
export interface StringAsserterRegex {
  readonly pattern: string;
  readonly requirements: readonly string[];
}

/**
 * `stringAsserter` returns a `StringAsserter` that asserts whether `value` is
 * of type `string` and valid according to the provided `StringAsserterOptions`.
 *
 * The `minLength` and `maxLength` `StringAsserterOptions` can be used to set
 * the minimum and maximum number of characters (as UTF-16 code units) allowed.
 *
 * The `StringAsserterOptions` `regex` can be used to specify a regular
 * expression to match against. `regex.pattern` must be a valid HTML `<input>`
 * `pattern` attribute value. It is compiled with `^(?:` at the start, `)$` at
 * the end, and with the `v` flag. `regex.requirements` must not be empty or
 * contain any blank `string`s.
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
 * export const _NonEmptyString = stringAsserter("NonEmptyString", {
 *   minLength: 1,
 * });
 *
 * export const _NumericString = stringAsserter("NumericString", {
 *   regex: { pattern: "\\d+", requirements: ["must be numeric"] },
 * });
 *
 * export const _Palindrome = stringAsserter("Palindrome", {
 *   validate(value) {
 *     if (value.length < 2) {
 *       return [];
 *     }
 *
 *     const forwardValue = value.replace(/[^0-9a-z]/gi, "");
 *     const backwardValue = forwardValue.split("").reverse().join("");
 *
 *     return forwardValue === backwardValue ? [] : ["must be a palindrome"];
 *   },
 * });
 * ```
 */
export function stringAsserter(
  assertedTypeName: string,
  { minLength, maxLength, regex, validate }: StringAsserterOptions,
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

  const regExp = regex ? new RegExp(`^(?:${regex.pattern})$`, "v") : undefined;

  if (
    regex &&
    (!regex.requirements.length ||
      regex.requirements.some((requirement) => /^\s*$/.test(requirement)))
  ) {
    throw new Error(
      "`regex.requirements` must not be empty or contain any blank `string`s if `regex` is defined",
    );
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
    } else if (maxLength !== undefined && value.length > maxLength) {
      issues.push(`must have a maximum of ${maxLength} characters`);
    }

    if (regex && !regExp!.test(value)) {
      issues.push(...regex.requirements);
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
  asserter.regex = regex;
  asserter.validate = validate;

  return asserter;
}
