// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";
import { Validator } from "./validator.ts";

/** `StringAsserterOptions` are passed to the `StringAsserter` constructor. */
export interface StringAsserterOptions {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly regex?: StringAsserterRegex;
  readonly rules?: readonly StringAsserterRule[];
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
 * `StringAsserterRule`s can be assigned to the `StringAsserterOptions` `rules`
 * property.
 */
export interface StringAsserterRule {
  readonly validate: (value: string) => boolean;
  readonly requirements: readonly string[];
}

/**
 * A `StringAsserter` is an `Asserter<string>`, with any additional constraints
 * defined by its `StringAsserterOptions` properties.
 *
 * The `minLength` and `maxLength` options can be used to set the minimum and
 * maximum number of characters (as UTF-16 code units) allowed.
 *
 * The `regex` option can be used to specify a regular expression to match
 * against. `regex.pattern` must be a valid HTML `<input>` `pattern` attribute
 * value. It is compiled with `^(?:` at the start, `)$` at the end, and with the
 * `v` flag. `regex.requirements` must not be empty or contain any blank
 * `string`s.
 *
 * The `rules` option can be used to specify `validate` functions and their
 * `requirements`. Each `validate` function should return `true` if `value` is
 * valid according to the rule, and `false` otherwise. `requirements` must not
 * be empty or contain any blank `string`s.
 *
 * The provided `StringAsserterOptions` are made accessible as properties of the
 * created `StringAsserter`.
 *
 * A `StringAsserter` is also a `Validator<string>` with a `validate` method,
 * which checks only that the provided `value` meets any constraints defined in
 * the `StringAsserterOptions`, and returns any issues. This can be used to
 * validate user input client side, where it should already be known that
 * `value` is a `string`.
 *
 * Example:
 *
 * ```ts
 * import { Asserted, StringAsserter } from "typeguardkit";
 *
 * export const _NonEmptyString = new StringAsserter("NonEmptyString", {
 *   minLength: 1,
 * });
 *
 * export type NonEmptyString = Asserted<typeof _NonEmptyString>;
 *
 * export const _NumericString = new StringAsserter("NumericString", {
 *   regex: { pattern: "\\d+", requirements: ["must be numeric"] },
 * });
 *
 * export type NumericString = Asserted<typeof _NumericString>;
 *
 * export const _Palindrome = new StringAsserter("Palindrome", {
 *   rules: [
 *     {
 *       validate(value) {
 *         if (value.length < 2) {
 *           return true;
 *         }
 *
 *         const forwardValue = value.replace(/[^0-9a-z]/gi, "");
 *         const backwardValue = forwardValue.split("").reverse().join("");
 *
 *         return forwardValue === backwardValue;
 *       },
 *
 *       requirements: ["must be a palindrome"],
 *     },
 *   ],
 * });
 *
 * export type Palindrome = Asserted<typeof _Palindrome>;
 * ```
 */
export class StringAsserter implements Asserter<string>, Validator<string> {
  readonly typeName: string;

  readonly minLength: number | null;
  readonly maxLength: number | null;
  readonly regex: StringAsserterRegex | null;
  readonly rules: readonly StringAsserterRule[];

  readonly #regExp?: RegExp;

  constructor(
    typeName: string,
    { minLength, maxLength, regex, rules }: StringAsserterOptions,
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

    this.#regExp = regex
      ? new RegExp(`^(?:${regex.pattern})$`, "v")
      : undefined;

    if (
      regex &&
      (!regex.requirements.length ||
        regex.requirements.some((requirement) => /^\s*$/.test(requirement)))
    ) {
      throw new Error(
        "`regex.requirements` must not be empty or contain any blank `string`s if `regex` is defined",
      );
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

    this.typeName = typeName || "UnnamedString";

    this.minLength = minLength ?? null;
    this.maxLength = maxLength ?? null;
    this.regex = regex ?? null;
    this.rules = rules ?? [];
  }

  assert(value: unknown, valueName?: string): string {
    if (typeof value !== "string") {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues = this.validate(value);

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    return value;
  }

  validate(value: string): string[] {
    const issues: string[] = [];

    const minLength = this.minLength;
    const maxLength = this.maxLength;

    if (
      minLength !== null && minLength === maxLength &&
      value.length !== minLength
    ) {
      issues.push(
        `must have ${minLength} character${minLength > 0 ? "s" : ""}`,
      );
    } else if (minLength !== null && value.length < minLength) {
      issues.push(
        `must have a minimum of ${minLength} character${
          minLength > 0 ? "s" : ""
        }`,
      );
    } else if (maxLength !== null && value.length > maxLength) {
      issues.push(
        `must have a maximum of ${maxLength} character${
          maxLength > 0 ? "s" : ""
        }`,
      );
    }

    if (this.regex && !this.#regExp!.test(value)) {
      issues.push(...this.regex.requirements);
    }

    for (const { validate, requirements } of this.rules) {
      if (!validate(value)) {
        issues.push(...requirements);
      }
    }

    return issues;
  }
}
