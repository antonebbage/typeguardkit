import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { Asserter, TypeAssertionError } from "../mod.ts";
import { numberAsserter, NumberAsserterOptions } from "./number_asserter.ts";

describe("numberAsserter", () => {
  const anyNumberTypeName = "AnyNumber";
  const anyNumberOptions: NumberAsserterOptions = {};
  const _AnyNumber = numberAsserter(anyNumberTypeName, anyNumberOptions);

  const validNumberOptions: NumberAsserterOptions = { disallowNaN: true };
  const _ValidNumber = numberAsserter("ValidNumber", validNumberOptions);

  const integerOptions: NumberAsserterOptions = { step: 1 };
  const _Integer = numberAsserter("Integer", integerOptions);

  const fractionalStep = 0.0001;

  const fractionalStepNumberOptions: NumberAsserterOptions = {
    step: fractionalStep,
  };

  const _FractionalStepNumber = numberAsserter(
    "FractionalStepNumber",
    fractionalStepNumberOptions,
  );

  const minValue = -10;
  const maxValue = 10;

  const numberInInclusiveRangeOptions: NumberAsserterOptions = {
    min: { value: minValue, inclusive: true },
    max: { value: maxValue, inclusive: true },
  };

  const _NumberInInclusiveRange = numberAsserter(
    "NumberInInclusiveRange",
    numberInInclusiveRangeOptions,
  );

  const evenNumberInExclusiveRangeOptions: NumberAsserterOptions = {
    min: { value: minValue, inclusive: false },
    max: { value: maxValue, inclusive: false },

    validate: (value) => {
      if (value % 2 !== 0) {
        return ["must be even"];
      }
      return [];
    },
  };

  const _EvenNumberInExclusiveRange = numberAsserter(
    "EvenNumberInExclusiveRange",
    evenNumberInExclusiveRangeOptions,
  );

  const positiveOddNumberOptions: NumberAsserterOptions = {
    min: { value: 1, inclusive: true },
    step: 2,
  };

  const _PositiveOddNumber = numberAsserter(
    "PositiveOddNumber",
    positiveOddNumberOptions,
  );

  const exclusiveMinPositiveOddNumberOptions: NumberAsserterOptions = {
    min: { value: 1, inclusive: false },
    step: 2,
  };

  const _ExclusiveMinPositiveOddNumber = numberAsserter(
    "ExclusiveMinPositiveOddNumber",
    exclusiveMinPositiveOddNumberOptions,
  );

  const unnamedAsserter = numberAsserter("", {});

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _AnyNumber, assertedTypeName: anyNumberTypeName },
      { asserter: unnamedAsserter, assertedTypeName: "UnnamedNumber" },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should throw an `Error` with correct `message` if `step` is defined but not a positive finite number", () => {
    const testCases = [-Infinity, -1000, -1, 0, Infinity];

    for (const step of testCases) {
      assertThrows(
        () => numberAsserter("", { step }),
        Error,
        "`step` must be positive and finite if defined",
      );
    }
  });

  it("should return a `Function` with the provided `NumberAsserterOptions` or correct defaults as properties", () => {
    const testCases = [
      { asserter: _AnyNumber, options: anyNumberOptions },
      { asserter: _ValidNumber, options: validNumberOptions },
      { asserter: _Integer, options: integerOptions },
      { asserter: _FractionalStepNumber, options: fractionalStepNumberOptions },

      {
        asserter: _NumberInInclusiveRange,
        options: numberInInclusiveRangeOptions,
      },

      {
        asserter: _EvenNumberInExclusiveRange,
        options: evenNumberInExclusiveRangeOptions,
      },

      { asserter: _PositiveOddNumber, options: positiveOddNumberOptions },

      {
        asserter: _ExclusiveMinPositiveOddNumber,
        options: exclusiveMinPositiveOddNumberOptions,
      },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.disallowNaN, !!options.disallowNaN);
      assertStrictEquals(asserter.min, options.min);
      assertStrictEquals(asserter.max, options.max);
      assertStrictEquals(asserter.step, options.step);
      assertStrictEquals(asserter.validate, options.validate);
    }
  });

  it("should return a `Function` that returns `value` when `value` is of type `number` and valid according to the provided `NumberAsserterOptions`", () => {
    const testCases = [
      {
        asserter: _AnyNumber,
        values: [NaN, -Infinity, -1000, -10.5, 0, 10.5, 1000, Infinity],
      },

      {
        asserter: _ValidNumber,
        values: [-Infinity, -1000, -10.5, 0, 10.5, 1000, Infinity],
      },

      {
        asserter: _Integer,
        values: [NaN, -1000, -10, -5, 0, 5, 10, 1000],
      },

      {
        asserter: _FractionalStepNumber,
        values: [NaN, -1000, -10.1, -5.05, 0, 5.005, 10.0001, 1000],
      },

      {
        asserter: _NumberInInclusiveRange,
        values: [NaN, -10, -5.5, 0, 5.5, 10],
      },

      { asserter: _EvenNumberInExclusiveRange, values: [NaN, -8, -4, 0, 4, 8] },
      { asserter: _PositiveOddNumber, values: [NaN, 1, 3, 5, 7, 9] },
      { asserter: _ExclusiveMinPositiveOddNumber, values: [NaN, 3, 5, 7, 9] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not of type `number` or is invalid according to the provided `NumberAsserterOptions`", () => {
    const typeIssue = "must be of type `number`";

    assertThrows(
      () => _AnyNumber(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_AnyNumber.assertedTypeName, undefined, {
        valueName: "name",
        issues: [typeIssue],
      })
        .message,
    );

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.assertedTypeName, undefined, {
        issues: [typeIssue],
      })
        .message,
    );

    const validIssue = "must be a valid number";
    const integerIssue = "must be a multiple of 1";
    const fractionalStepIssue = `must be a multiple of ${fractionalStep}`;
    const inclusiveMinIssue = `must be >= ${minValue}`;
    const inclusiveMaxIssue = `must be <= ${maxValue}`;
    const exclusiveMinIssue = `must be > ${minValue}`;
    const exclusiveMaxIssue = `must be < ${maxValue}`;
    const evenIssue = "must be even";
    const positiveOddMinIssue = "must be >= 1";
    const positiveOddStepIssue = "must be a multiple of 2 from 1";
    const exclusiveMinPositiveOddMinIssue = "must be > 1";

    const testCases: Array<{
      asserter: Asserter<unknown>;
      values: Array<[value: unknown, issues: string[]]>;
    }> = [
      {
        asserter: _AnyNumber,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          ["", [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],
        ],
      },

      {
        asserter: _ValidNumber,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          ["", [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],
          [NaN, [validIssue]],
        ],
      },

      {
        asserter: _Integer,

        values: [
          [-Infinity, [integerIssue]],
          [-10.5, [integerIssue]],
          [10.5, [integerIssue]],
          [Infinity, [integerIssue]],
        ],
      },

      {
        asserter: _FractionalStepNumber,

        values: [
          [-Infinity, [fractionalStepIssue]],
          [-10.00001, [fractionalStepIssue]],
          [10.00001, [fractionalStepIssue]],
          [Infinity, [fractionalStepIssue]],
        ],
      },

      {
        asserter: _NumberInInclusiveRange,

        values: [
          [-Infinity, [inclusiveMinIssue]],
          [-10.5, [inclusiveMinIssue]],
          [10.5, [inclusiveMaxIssue]],
          [Infinity, [inclusiveMaxIssue]],
        ],
      },

      {
        asserter: _EvenNumberInExclusiveRange,

        values: [
          [-Infinity, [exclusiveMinIssue, evenIssue]],
          [-10, [exclusiveMinIssue]],
          [-9.5, [evenIssue]],
          [-9, [evenIssue]],
          [9, [evenIssue]],
          [9.5, [evenIssue]],
          [10, [exclusiveMaxIssue]],
          [Infinity, [exclusiveMaxIssue, evenIssue]],
        ],
      },

      {
        asserter: _PositiveOddNumber,

        values: [
          [-Infinity, [positiveOddMinIssue, positiveOddStepIssue]],
          [-1, [positiveOddMinIssue]],
          [0, [positiveOddMinIssue, positiveOddStepIssue]],
          [2, [positiveOddStepIssue]],
          [Infinity, [positiveOddStepIssue]],
        ],
      },

      {
        asserter: _ExclusiveMinPositiveOddNumber,

        values: [
          [-Infinity, [exclusiveMinPositiveOddMinIssue, positiveOddStepIssue]],
          [-1, [exclusiveMinPositiveOddMinIssue]],
          [0, [exclusiveMinPositiveOddMinIssue, positiveOddStepIssue]],
          [1, [exclusiveMinPositiveOddMinIssue]],
          [2, [positiveOddStepIssue]],
          [Infinity, [positiveOddStepIssue]],
        ],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const [value, issues] of values) {
        assertThrows(
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.assertedTypeName, value, { issues })
            .message,
        );
      }
    }
  });
});
