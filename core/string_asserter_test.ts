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

  const minLength = 1;
  const maxLength = 8;

  const constrainedLengthStringOptions: StringAsserterOptions = {
    minLength,
    maxLength,
  };

  const _ConstrainedLengthString = stringAsserter(
    "ConstrainedLengthString",
    constrainedLengthStringOptions,
  );

  const lettersIssue = "must contain one or more letters";

  const letterStringOptions: StringAsserterOptions = {
    regex: { pattern: "\\p{Letter}+", requirements: [lettersIssue] },
  };

  const _LetterString = stringAsserter("LetterString", letterStringOptions);

  const palindromeIssue = "must be a palindrome";

  const palindromeOptions: StringAsserterOptions = {
    validate(value) {
      if (value.length < 2) {
        return [];
      }

      const forwardValue = value.replace(/[^0-9a-z]/gi, "");
      const backwardValue = forwardValue.split("").reverse().join("");

      return forwardValue === backwardValue ? [] : [palindromeIssue];
    },
  };

  const _Palindrome = stringAsserter("Palindrome", palindromeOptions);

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

  it("should throw an `Error` with correct `message` if `minLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const minLength of testCases) {
      assertThrows(
        () => stringAsserter("", { minLength }),
        Error,
        "`minLength` must be a positive integer if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `maxLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const maxLength of testCases) {
      assertThrows(
        () => stringAsserter("", { maxLength }),
        Error,
        "`maxLength` must be a positive integer if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `minLength` and `maxLength` are defined but `minLength` > `maxLength`", () => {
    const testCases = [
      { minLength: 2, maxLength: 1 },
      { minLength: 20, maxLength: 10 },
      { minLength: 200, maxLength: 100 },
    ];

    for (const { minLength, maxLength } of testCases) {
      assertThrows(
        () => stringAsserter("", { minLength, maxLength }),
        Error,
        "`minLength` must be <= `maxLength` if both are defined",
      );
    }
  });

  it("should throw a `SyntaxError` if `regex.pattern` is invalid", () => {
    const testCases = ["(", "[(]"];

    for (const value of testCases) {
      assertThrows(
        () =>
          stringAsserter("", {
            regex: { pattern: value, requirements: ["requirement"] },
          }),
        SyntaxError,
      );
    }
  });

  it("should throw an `Error` with correct `message` if `regex` is defined but `regex.requirements` is empty or contains any blank `string`s", () => {
    const testCases = [
      [],
      [""],
      [" "],
      ["", "requirement"],
      ["requirement", ""],
    ];

    for (const requirements of testCases) {
      assertThrows(
        () => stringAsserter("", { regex: { pattern: "", requirements } }),
        Error,
        "`regex.requirements` must not be empty or contain any blank `string`s if `regex` is defined",
      );
    }
  });

  it("should return a `Function` with the provided `StringAsserterOptions` or correct defaults as properties", () => {
    const testCases = [
      { asserter: _AnyString, options: anyStringOptions },

      {
        asserter: _ConstrainedLengthString,
        options: constrainedLengthStringOptions,
      },

      { asserter: _LetterString, options: letterStringOptions },
      { asserter: _Palindrome, options: palindromeOptions },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.minLength, options.minLength);
      assertStrictEquals(asserter.maxLength, options.maxLength);
      assertStrictEquals(asserter.regex, options.regex);
      assertStrictEquals(asserter.validate, options.validate);
    }
  });

  it("should return a `Function` that returns `value` when `value` is of type `string` and valid according to the provided `StringAsserterOptions`", () => {
    const testCases = [
      { asserter: _AnyString, values: ["", "abc", "123"] },
      { asserter: _ConstrainedLengthString, values: ["a", "12345678"] },
      { asserter: _LetterString, values: ["AaÉé中に"] },
      { asserter: _Palindrome, values: ["", "a", "aa", "aba"] },
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

    const minLengthIssue = `must have a minimum of ${minLength} characters`;
    const maxLengthIssue = `must have a maximum of ${maxLength} characters`;

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
        asserter: _ConstrainedLengthString,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          [0, [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],

          ["", [minLengthIssue]],
          ["123456789", [maxLengthIssue]],
        ],
      },

      {
        asserter: _LetterString,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          [0, [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],

          ["", [lettersIssue]],
          [" ", [lettersIssue]],
          [".", [lettersIssue]],
          ["0", [lettersIssue]],
        ],
      },

      {
        asserter: _Palindrome,

        values: [
          [undefined, [typeIssue]],
          [null, [typeIssue]],
          [false, [typeIssue]],
          [0, [typeIssue]],
          [[], [typeIssue]],
          [{}, [typeIssue]],

          ["ab", [palindromeIssue]],
          ["abc", [palindromeIssue]],
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
