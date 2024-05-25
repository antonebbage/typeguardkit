import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { StringAsserter, StringAsserterOptions } from "./string_asserter.ts";

const anyStringTypeName = "AnyString";
const anyStringOptions: StringAsserterOptions = {};
const _AnyString = new StringAsserter(anyStringTypeName, anyStringOptions);

const constrainedLengthStringOptions: StringAsserterOptions = {
  minLength: 1,
  maxLength: 8,
};

const _ConstrainedLengthString = new StringAsserter(
  "ConstrainedLengthString",
  constrainedLengthStringOptions,
);

const lettersIssue = "must contain one or more letters";

const letterStringOptions: StringAsserterOptions = {
  regex: { pattern: "\\p{Letter}+", requirements: [lettersIssue] },
};

const _LetterString = new StringAsserter("LetterString", letterStringOptions);

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

const _Palindrome = new StringAsserter("Palindrome", palindromeOptions);

const unnamedAsserter = new StringAsserter("", {});

describe("StringAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _AnyString, typeName: anyStringTypeName },
      { asserter: unnamedAsserter, typeName: "UnnamedString" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `StringAsserterOptions` or correct defaults as properties", () => {
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

  it("should throw an `Error` with correct `message` if `minLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const minLength of testCases) {
      assertThrows(
        () => new StringAsserter("", { minLength }),
        Error,
        "`minLength` must be a positive integer if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `maxLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const maxLength of testCases) {
      assertThrows(
        () => new StringAsserter("", { maxLength }),
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
        () => new StringAsserter("", { minLength, maxLength }),
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
          new StringAsserter("", {
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
        () => new StringAsserter("", { regex: { pattern: "", requirements } }),
        Error,
        "`regex.requirements` must not be empty or contain any blank `string`s if `regex` is defined",
      );
    }
  });
});

describe("StringAsserter.assert", () => {
  it("should return `value` when `value` is of type `string` and valid according to the provided `StringAsserterOptions`", () => {
    const testCases = [
      { asserter: _AnyString, values: ["", "abc", "123"] },
      { asserter: _ConstrainedLengthString, values: ["a", "12345678"] },
      { asserter: _LetterString, values: ["AaÉé中に"] },
      { asserter: _Palindrome, values: ["", "a", "aa", "aba"] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not of type `string` or is invalid according to the provided `StringAsserterOptions`", () => {
    const typeIssue = "must be of type `string`";

    assertThrows(
      () => _AnyString.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_AnyString.typeName, undefined, {
        valueName: "name",
        issues: [typeIssue],
      })
        .message,
    );

    assertThrows(
      () => unnamedAsserter.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined, {
        issues: [typeIssue],
      })
        .message,
    );

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

          ["", [
            `must have a minimum of ${_ConstrainedLengthString.minLength} character`,
          ]],

          ["123456789", [
            `must have a maximum of ${_ConstrainedLengthString.maxLength} characters`,
          ]],
        ],
      },

      {
        asserter: new StringAsserter("", { minLength: 1, maxLength: 1 }),

        values: [
          ["", ["must have 1 character"]],
          ["ab", ["must have 1 character"]],
        ],
      },

      {
        asserter: new StringAsserter("", { minLength: 2, maxLength: 2 }),

        values: [
          ["a", ["must have 2 characters"]],
          ["abc", ["must have 2 characters"]],
        ],
      },

      {
        asserter: new StringAsserter("", { minLength: 2 }),
        values: [["a", ["must have a minimum of 2 characters"]]],
      },

      {
        asserter: new StringAsserter("", { maxLength: 1 }),
        values: [["ab", ["must have a maximum of 1 character"]]],
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
          ["a0", [lettersIssue]],
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
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value, { issues }).message,
        );
      }
    }
  });
});
