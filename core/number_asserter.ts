// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * A `NumberAsserter` is an `Asserter<number>` with any additional validation
 * defined by its `NumberAsserterOptions` properties.
 */
export interface NumberAsserter
  extends Asserter<number>, NumberAsserterOptions {}

/** `NumberAsserterOptions` can be passed to the `numberAsserter` function. */
export interface NumberAsserterOptions {
  readonly subtype?: NumberAsserterSubtype;
  readonly min?: NumberAsserterBound;
  readonly max?: NumberAsserterBound;
  readonly validate?: (value: number) => string[];
}

/**
 * A `NumberAsserterSubtype` can be set for the `subtype` in
 * `NumberAsserterOptions`.
 */
export type NumberAsserterSubtype = "valid" | "integer";

/**
 * A `NumberAsserterBound` can be set for the `min` and `max`
 * `NumberAsserterOptions`.
 */
export interface NumberAsserterBound {
  readonly value: number;
  readonly inclusive: boolean;
}

/**
 * `numberAsserter` returns a `NumberAsserter` that asserts whether `value` is
 * of type `number` and valid according to the provided `NumberAsserterOptions`.
 *
 * If the `NumberAsserterOptions` `subtype` is `"valid"`, `value` cannot be
 * `NaN`. If `subtype` is `"integer"`, `value` cannot be `NaN` and must be an
 * integer.
 *
 * The provided `NumberAsserterOptions` are made accessible as properties of the
 * returned `NumberAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { numberAsserter } from "../mod.ts";
 *
 * export const _EvenNumberInRange = numberAsserter(
 *   "EvenNumberInRange",
 *   {
 *     min: { value: 0, inclusive: true },
 *     max: { value: 100, inclusive: true },
 *
 *     validate: (value) => {
 *       if (value % 2 !== 0) {
 *         return ["must be even"];
 *       }
 *       return [];
 *     },
 *   },
 * );
 * ```
 */
export function numberAsserter(
  typeName: string,
  { subtype, min, max, validate }: NumberAsserterOptions,
): NumberAsserter {
  typeName ||= "UnnamedNumber";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "number") {
      throw new TypeAssertionError(typeName, value, {
        valueName,
        issues: "must be of type `number`",
      });
    }

    const issues: string[] = [];

    if (subtype === "valid") {
      if (isNaN(value)) {
        issues.push("must be a valid number");
      }
    } else if (subtype === "integer" && !Number.isInteger(value)) {
      issues.push("must be an integer");
    }

    if (min) {
      if (min.inclusive) {
        if (!(value >= min.value)) {
          issues.push(`must be >= ${min.value}`);
        }
      } else if (!(value > min.value)) {
        issues.push(`must be > ${min.value}`);
      }
    }

    if (max) {
      if (max.inclusive) {
        if (!(value <= max.value)) {
          issues.push(`must be <= ${max.value}`);
        }
      } else if (!(value < max.value)) {
        issues.push(`must be < ${max.value}`);
      }
    }

    if (validate) {
      issues.push(...validate(value));
    }

    if (issues.length) {
      throw new TypeAssertionError(typeName, value, { valueName, issues });
    }

    return value;
  };

  asserter.typeName = typeName;

  asserter.subtype = subtype;
  asserter.min = min;
  asserter.max = max;
  asserter.validate = validate;

  return asserter;
}
