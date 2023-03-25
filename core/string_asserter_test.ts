import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import {
  StringAsserter,
  stringAsserter,
  StringAsserterOptions,
} from "./string_asserter.ts";

describe("stringAsserter", () => {
  const anyStringTypeName = "AnyString";
  const anyStringOptions: StringAsserterOptions = {};
  const _AnyString = stringAsserter(anyStringTypeName, anyStringOptions);

  const nonEmptyStringOptions: StringAsserterOptions = {
    validate: (value) => value ? [] : ["must be non-empty"],
  };

  const _NonEmptyString = stringAsserter(
    "NonEmptyString",
    nonEmptyStringOptions,
  );

  const unnamedAsserter = stringAsserter("", {});

  it("should return a `Function`", () => {
    assertInstanceOf(_AnyString, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(_AnyString.asserterTypeName, "StringAsserter");
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _AnyString, assertedTypeName: anyStringTypeName },
      { asserter: unnamedAsserter, assertedTypeName: "UnnamedString" },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` with the provided `StringAsserterOptions` or correct defaults as properties", () => {
    const testCases = [
      { asserter: _AnyString, options: anyStringOptions },
      { asserter: _NonEmptyString, options: nonEmptyStringOptions },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.validate, options.validate);
    }
  });

  it("should return a `Function` that returns `value` when `value` is of type `string` and valid according to the provided `StringAsserterOptions`", () => {
    const testCases = [
      { asserter: _AnyString, values: ["", "abc", "123"] },
      { asserter: _NonEmptyString, values: ["abc", "123"] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not of type `string` or is invalid according to the provided `StringAsserterOptions`", () => {
    const typeIssue = "must be of type `string`";

    assertThrows(
      () => _AnyString(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_AnyString.assertedTypeName, undefined, {
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

    const nonEmptyIssue = "must be non-empty";

    const testCases: Array<{
      asserter: StringAsserter;
      values: Array<[value: unknown, issues: string[]]>;
    }> = [
      {
        asserter: _AnyString,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          [0, [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],
        ],
      },

      {
        asserter: _NonEmptyString,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          [0, [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],

          ["", [nonEmptyIssue]],
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
