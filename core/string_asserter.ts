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
  readonly validate?: (value: string) => string[];
}

/**
 * `stringAsserter` returns a `StringAsserter` that asserts whether `value` is
 * of type `string` and valid according to the provided `StringAsserterOptions`.
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
 *   { validate: (value) => value ? [] : ["must be non-empty"] },
 * );
 * ```
 */
export function stringAsserter(
  assertedTypeName: string,
  { validate }: StringAsserterOptions,
): StringAsserter {
  assertedTypeName ||= "UnnamedString";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "string") {
      throw new TypeAssertionError(assertedTypeName, value, {
        valueName,
        issues: "must be of type `string`",
      });
    }

    const issues: string[] = [];

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

  asserter.validate = validate;

  return asserter;
}
