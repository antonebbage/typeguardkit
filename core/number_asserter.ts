// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `NumberAsserterOptions` can be passed to the `numberAsserter` function. */
export interface NumberAsserterOptions {
  disallowNaN?: boolean;
  integersOnly?: boolean;
  min?: number;
  minExclusive?: boolean;
  max?: number;
  maxExclusive?: boolean;
  validate?: (value: number) => string[];
}

/**
 * `numberAsserter` returns an `Asserter<number>` that asserts whether `value`
 * is of type `number` and valid according to the provided
 * `NumberAsserterOptions`.
 *
 * Example:
 *
 * ```ts
 * import { numberAsserter } from "../mod.ts";
 *
 * export const _EvenNumberInRange = numberAsserter(
 *   "EvenNumberInRange",
 *   {
 *     min: 0,
 *     max: 100,
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
  {
    disallowNaN = false,
    integersOnly = false,
    min,
    minExclusive = false,
    max,
    maxExclusive = false,
    validate,
  }: NumberAsserterOptions,
): Asserter<number> {
  typeName ||= "UnnamedNumber";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "number") {
      throw new TypeAssertionError(typeName, value, {
        valueName,
        issues: "must be of type `number`",
      });
    }

    const issues: string[] = [];

    if (disallowNaN && isNaN(value)) {
      issues.push("must be a valid number");
    }

    if (integersOnly && !Number.isInteger(value)) {
      issues.push("must be an integer");
    }

    if (min !== undefined) {
      if (minExclusive) {
        if (!(value > min)) {
          issues.push(`must be > ${min}`);
        }
      } else if (!(value >= min)) {
        issues.push(`must be >= ${min}`);
      }
    }

    if (max !== undefined) {
      if (maxExclusive) {
        if (!(value < max)) {
          issues.push(`must be < ${max}`);
        }
      } else if (!(value <= max)) {
        issues.push(`must be <= ${max}`);
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

  return asserter;
}
