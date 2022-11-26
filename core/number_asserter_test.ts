import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { Asserter, TypeAssertionError } from "../mod.ts";
import { numberAsserter } from "./number_asserter.ts";

describe("numberAsserter", () => {
  const _AnyNumber = numberAsserter("AnyNumber", {});

  const _ValidNumber = numberAsserter("ValidNumber", { subtype: "valid" });

  const _Integer = numberAsserter("Integer", { subtype: "integer" });

  const min = -10;
  const max = 10;

  const _NumberInInclusiveRange = numberAsserter("NumberInInclusiveRange", {
    min: { value: min, inclusive: true },
    max: { value: max, inclusive: true },
  });

  const _EvenNumberInExclusiveRange = numberAsserter(
    "EvenNumberInExclusiveRange",
    {
      min: { value: min, inclusive: false },
      max: { value: max, inclusive: false },

      validate: (value) => {
        if (value % 2 !== 0) {
          return ["must be even"];
        }
        return [];
      },
    },
  );

  const unnamedAsserter = numberAsserter("", {});

  it("should return a `Function` with the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _AnyNumber, typeName: "AnyNumber" },
      { asserter: unnamedAsserter, typeName: "UnnamedNumber" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
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
        values: [-1000, -10, -5, 0, 5, 10, 1000],
      },

      { asserter: _NumberInInclusiveRange, values: [-10, -5.5, 0, 5.5, 10] },
      { asserter: _EvenNumberInExclusiveRange, values: [-8, -4, 0, 4, 8] },
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
      new TypeAssertionError(_AnyNumber.typeName, undefined, {
        valueName: "name",
        issues: [typeIssue],
      })
        .message,
    );

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined, {
        issues: [typeIssue],
      })
        .message,
    );

    const validIssue = "must be a valid number";
    const integerIssue = "must be an integer";
    const inclusiveMinIssue = `must be >= ${min}`;
    const inclusiveMaxIssue = `must be <= ${max}`;
    const exclusiveMinIssue = `must be > ${min}`;
    const exclusiveMaxIssue = `must be < ${max}`;
    const evenIssue = "must be even";

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
          [NaN, [integerIssue]],
          [-Infinity, [integerIssue]],
          [-10.5, [integerIssue]],
          [10.5, [integerIssue]],
          [Infinity, [integerIssue]],
        ],
      },

      {
        asserter: _NumberInInclusiveRange,

        values: [
          [NaN, [inclusiveMinIssue, inclusiveMaxIssue]],
          [-Infinity, [inclusiveMinIssue]],
          [-10.5, [inclusiveMinIssue]],
          [10.5, [inclusiveMaxIssue]],
          [Infinity, [inclusiveMaxIssue]],
        ],
      },

      {
        asserter: _EvenNumberInExclusiveRange,

        values: [
          [NaN, [exclusiveMinIssue, exclusiveMaxIssue, evenIssue]],
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
    ];

    for (const { asserter, values } of testCases) {
      for (const [value, issues] of values) {
        assertThrows(
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value, { issues }).message,
        );
      }
    }
  });
});
