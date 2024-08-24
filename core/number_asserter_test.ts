import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { NumberAsserter, NumberAsserterOptions } from "./number_asserter.ts";

const anyNumberTypeName = "AnyNumber";
const anyNumberOptions: NumberAsserterOptions = {};
const _AnyNumber = new NumberAsserter(anyNumberTypeName, anyNumberOptions);

const validNumberOptions: NumberAsserterOptions = { disallowNaN: true };
const _ValidNumber = new NumberAsserter("ValidNumber", validNumberOptions);

const integerOptions: NumberAsserterOptions = { step: 1 };
const _Integer = new NumberAsserter("Integer", integerOptions);

const fractionalStep = 0.0001;

const fractionalStepNumberOptions: NumberAsserterOptions = {
  step: fractionalStep,
};

const _FractionalStepNumber = new NumberAsserter(
  "FractionalStepNumber",
  fractionalStepNumberOptions,
);

const minValue = -10;
const maxValue = 10;

const numberInInclusiveRangeOptions: NumberAsserterOptions = {
  min: { value: minValue, inclusive: true },
  max: { value: maxValue, inclusive: true },
};

const _NumberInInclusiveRange = new NumberAsserter(
  "NumberInInclusiveRange",
  numberInInclusiveRangeOptions,
);

const evenIssue = "must be even";

const evenNumberInExclusiveRangeOptions: NumberAsserterOptions = {
  min: { value: minValue, inclusive: false },
  max: { value: maxValue, inclusive: false },
  rules: [{ validate: (value) => value % 2 === 0, requirements: [evenIssue] }],
};

const _EvenNumberInExclusiveRange = new NumberAsserter(
  "EvenNumberInExclusiveRange",
  evenNumberInExclusiveRangeOptions,
);

const positiveOddNumberOptions: NumberAsserterOptions = {
  min: { value: 1, inclusive: true },
  step: 2,
};

const _PositiveOddNumber = new NumberAsserter(
  "PositiveOddNumber",
  positiveOddNumberOptions,
);

const exclusiveMinPositiveOddNumberOptions: NumberAsserterOptions = {
  min: { value: 1, inclusive: false },
  step: 2,
};

const _ExclusiveMinPositiveOddNumber = new NumberAsserter(
  "ExclusiveMinPositiveOddNumber",
  exclusiveMinPositiveOddNumberOptions,
);

const unnamedAsserter = new NumberAsserter("", {});

describe("NumberAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _AnyNumber, typeName: anyNumberTypeName },
      { asserter: unnamedAsserter, typeName: "UnnamedNumber" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `NumberAsserterOptions` or correct defaults as properties", () => {
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
      assertStrictEquals(asserter.min, options.min ?? null);
      assertStrictEquals(asserter.max, options.max ?? null);
      assertStrictEquals(asserter.step, options.step ?? null);

      if (options.rules) {
        assertStrictEquals(asserter.rules, options.rules);
      } else {
        assertEquals(asserter.rules, []);
      }
    }
  });

  it("should throw an `Error` with correct `message` if `step` is defined but not a positive finite number", () => {
    const testCases = [-Infinity, -1000, -1, 0, Infinity];

    for (const step of testCases) {
      assertThrows(
        () => new NumberAsserter("", { step }),
        Error,
        "`step` must be positive and finite if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `rules` is defined but there is a rule whose `requirements` is empty or contains any blank `string`s", () => {
    const testCases = [
      [],
      [""],
      [" "],
      ["", "requirement"],
      ["requirement", ""],
    ];

    for (const requirements of testCases) {
      assertThrows(
        () =>
          new NumberAsserter("", {
            rules: [{ validate: () => true, requirements }],
          }),
        Error,
        "rule `requirements` must not be empty or contain any blank `string`s",
      );
    }
  });
});

describe("NumberAsserter.assert", () => {
  it("should return `value` when `value` is of type `number` and valid according to the provided `NumberAsserterOptions`", () => {
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
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not of type `number` or is invalid according to the provided `NumberAsserterOptions`", () => {
    assertThrows(
      () => _AnyNumber.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_AnyNumber.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => unnamedAsserter.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
    );

    const validIssue = "must be a valid number";
    const integerIssue = "must be a multiple of 1";
    const fractionalStepIssue = `must be a multiple of ${fractionalStep}`;
    const inclusiveMinIssue = `must be >= ${minValue}`;
    const inclusiveMaxIssue = `must be <= ${maxValue}`;
    const exclusiveMinIssue = `must be > ${minValue}`;
    const exclusiveMaxIssue = `must be < ${maxValue}`;
    const positiveOddMinIssue = "must be >= 1";
    const positiveOddStepIssue = "must be a multiple of 2 from 1";
    const exclusiveMinPositiveOddMinIssue = "must be > 1";

    const testCases: Array<{
      asserter: NumberAsserter;
      values: Array<[value: unknown, issues?: string[]]>;
    }> = [
      {
        asserter: _AnyNumber,

        values: [
          [undefined],
          [null],
          [false],
          [""],
          [[]],
          [{}],
        ],
      },

      {
        asserter: _ValidNumber,

        values: [
          [undefined],
          [null],
          [false],
          [""],
          [[]],
          [{}],

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
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value, { issues }).message,
        );
      }
    }
  });
});
