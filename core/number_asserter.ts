// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const numberAsserterTypeName = "NumberAsserter" as const;

/**
 * A `NumberAsserter` is an `Asserter<number>` with any additional validation
 * defined by its `NumberAsserterOptions` properties.
 */
export interface NumberAsserter
  extends Asserter<number>, NumberAsserterOptions {
  readonly asserterTypeName: typeof numberAsserterTypeName;

  readonly disallowNaN: boolean;
}

/** `NumberAsserterOptions` can be passed to the `numberAsserter` function. */
export interface NumberAsserterOptions {
  readonly disallowNaN?: boolean;
  readonly min?: NumberAsserterBound;
  readonly max?: NumberAsserterBound;
  readonly step?: number;
  readonly validate?: (value: number) => string[];
}

/**
 * A `NumberAsserterBound` can be assigned to the `min` and `max`
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
 * If defined, the `NumberAsserterOptions` `validate` function should return an
 * empty array if `value` is valid, or an array of issues if `value` is invalid.
 *
 * The provided `NumberAsserterOptions` are made accessible as properties of the
 * returned `NumberAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { numberAsserter } from "../mod.ts";
 *
 * export const _EvenNumberInRange = numberAsserter("EvenNumberInRange", {
 *   min: { value: 0, inclusive: true },
 *   max: { value: 100, inclusive: true },
 *   step: 2,
 * });
 * ```
 */
export function numberAsserter(
  assertedTypeName: string,
  { disallowNaN = false, min, max, step, validate }: NumberAsserterOptions,
): NumberAsserter {
  if (step !== undefined && (step <= 0 || !isFinite(step))) {
    throw new Error("`step` must be positive and finite if defined");
  }

  assertedTypeName ||= "UnnamedNumber";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "number") {
      throw new TypeAssertionError(assertedTypeName, value, {
        valueName,
        issues: "must be of type `number`",
      });
    }

    const issues: string[] = [];

    if (disallowNaN) {
      if (isNaN(value)) {
        issues.push("must be a valid number");
      }
    } else if (isNaN(value)) {
      return value;
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

    if (step !== undefined) {
      let isStepMismatch = false;

      if (!isFinite(value)) {
        isStepMismatch = true;
      } else {
        // Using `valueInteger`, `minValueInteger`, and `stepInteger` with `%`
        // operator to try to avoid unexpected results due to floating-point
        // precision.

        const decimalPlaceCount = (value: number): number =>
          `${value}`.split(".")[1]?.length ?? 0;

        const valueDecimalPlaceCount = decimalPlaceCount(value);

        const minVaiueDecimalPlaceCount = min
          ? decimalPlaceCount(min.value)
          : 0;

        const stepDecimalPlaceCount = decimalPlaceCount(step);

        const largestDecimalPlaceCount = Math.max(
          valueDecimalPlaceCount,
          minVaiueDecimalPlaceCount,
          stepDecimalPlaceCount,
        );

        const integer = (value: number): number =>
          Number(value.toFixed(largestDecimalPlaceCount).replace(".", ""));

        const valueInteger = integer(value);
        const minValueInteger = min ? integer(min.value) : 0;
        const stepInteger = integer(step);

        isStepMismatch = (valueInteger - minValueInteger) % stepInteger !== 0;
      }

      if (isStepMismatch) {
        let issue = `must be a multiple of ${step}`;

        if (min?.value) {
          issue += ` from ${min.value}`;
        }

        issues.push(issue);
      }
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

  asserter.asserterTypeName = numberAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  asserter.disallowNaN = disallowNaN;
  asserter.min = min;
  asserter.max = max;
  asserter.step = step;
  asserter.validate = validate;

  return asserter;
}
