// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/** `NumberAsserterOptions` are passed to the `NumberAsserter` constructor. */
export interface NumberAsserterOptions {
  readonly disallowNaN?: boolean;
  readonly min?: NumberAsserterBound;
  readonly max?: NumberAsserterBound;
  readonly step?: number;
  readonly rules?: NumberAsserterRule[];
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
 * `NumberAsserterRule`s can be assigned to the `NumberAsserterOptions` `rules`
 * property.
 */
export interface NumberAsserterRule {
  readonly validate: (value: number) => boolean;
  readonly requirements: readonly string[];
}

/**
 * A `NumberAsserter` is an `Asserter<number>`, with any additional validation
 * defined by its `NumberAsserterOptions` properties.
 *
 * The `rules` option can be used to specify `validate` functions and their
 * `requirements`. Each `validate` function should return `true` if `value` is
 * valid according to the rule, and `false` otherwise. `requirements` must not
 * be empty or contain any blank `string`s.
 *
 * The provided `NumberAsserterOptions` are made accessible as properties of the
 * created `NumberAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { NumberAsserter } from "../mod.ts";
 *
 * export const _EvenNumberInRange = new NumberAsserter("EvenNumberInRange", {
 *   min: { value: 0, inclusive: true },
 *   max: { value: 100, inclusive: true },
 *   step: 2,
 * });
 *
 * export type EvenNumberInRange = ReturnType<typeof _EvenNumberInRange.assert>;
 * ```
 */
export class NumberAsserter implements Asserter<number> {
  readonly typeName: string;

  readonly disallowNaN: boolean;
  readonly min: NumberAsserterBound | null;
  readonly max: NumberAsserterBound | null;
  readonly step: number | null;
  readonly rules: NumberAsserterRule[];

  constructor(
    typeName: string,
    { disallowNaN = false, min, max, step, rules }: NumberAsserterOptions,
  ) {
    if (step !== undefined && (step <= 0 || !isFinite(step))) {
      throw new Error("`step` must be positive and finite if defined");
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

    this.typeName = typeName || "UnnamedNumber";

    this.disallowNaN = disallowNaN;
    this.min = min ?? null;
    this.max = max ?? null;
    this.step = step ?? null;
    this.rules = rules ?? [];
  }

  assert(value: unknown, valueName?: string): number {
    if (typeof value !== "number") {
      throw new TypeAssertionError(this.typeName, value, {
        valueName,
        issues: "must be of type `number`",
      });
    }

    const issues: string[] = [];

    if (this.disallowNaN) {
      if (isNaN(value)) {
        issues.push("must be a valid number");
      }
    } else if (isNaN(value)) {
      return value;
    }

    const min = this.min;

    if (min) {
      if (min.inclusive) {
        if (value < min.value) {
          issues.push(`must be >= ${min.value}`);
        }
      } else if (value <= min.value) {
        issues.push(`must be > ${min.value}`);
      }
    }

    const max = this.max;

    if (max) {
      if (max.inclusive) {
        if (value > max.value) {
          issues.push(`must be <= ${max.value}`);
        }
      } else if (value >= max.value) {
        issues.push(`must be < ${max.value}`);
      }
    }

    const step = this.step;

    if (step !== null) {
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

    for (const { validate, requirements } of this.rules) {
      if (!validate(value)) {
        issues.push(...requirements);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    return value;
  }
}
