import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  TypeAsserter,
  typeAsserterTypeName,
  TypeAssertionError,
} from "../mod.ts";
import { arrayOf, ArrayOfOptions } from "./array_of.ts";

describe("arrayOf", () => {
  const _ArrayOfString = arrayOf(_string);
  const _ArrayOfNumber = arrayOf(_number);

  const minLength = 1;
  const maxLength = 8;

  const constrainedLengthArrayOfStringTypeName =
    "ConstrainedLengthArrayOfString";

  const constrainedLengthArrayOfStringOptions: ArrayOfOptions = {
    minLength,
    maxLength,
  };

  const _ConstrainedLengthArrayOfString = arrayOf(
    _string,
    constrainedLengthArrayOfStringOptions,
    constrainedLengthArrayOfStringTypeName,
  );

  it("should return a `Function`", () => {
    assertInstanceOf(_ArrayOfString, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(_ArrayOfString.asserterTypeName, typeAsserterTypeName);
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: _ConstrainedLengthArrayOfString,
        assertedTypeName: constrainedLengthArrayOfStringTypeName,
      },

      {
        asserter: _ArrayOfString,
        assertedTypeName: `Array<${_string.assertedTypeName}>`,
      },

      {
        asserter: _ArrayOfNumber,
        assertedTypeName: `Array<${_number.assertedTypeName}>`,
      },

      {
        asserter: arrayOf(_string, {}, ""),
        assertedTypeName: `Array<${_string.assertedTypeName}>`,
      },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should throw an `Error` with correct `message` if `minLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const minLength of testCases) {
      assertThrows(
        () => arrayOf(_string, { minLength }),
        Error,
        "`minLength` must be a positive integer if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `maxLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const maxLength of testCases) {
      assertThrows(
        () => arrayOf(_string, { maxLength }),
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
        () => arrayOf(_string, { minLength, maxLength }),
        Error,
        "`minLength` must be <= `maxLength` if both are defined",
      );
    }
  });

  it("should return a `Function` that returns `value` when it is an `Array` where `asserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _ArrayOfString, values: [[], [""], ["a", "b", "c"]] },
      { asserter: _ArrayOfNumber, values: [[], [0], [0, 1, 2]] },

      {
        asserter: _ConstrainedLengthArrayOfString,
        values: [[""], ["", "", "", "", "", "", "", ""]],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an `Array` where `asserter` does not throw an error for any element", () => {
    assertThrows(
      () => _ArrayOfString([undefined, undefined], "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _ArrayOfString.assertedTypeName,
        [undefined, undefined],
        {
          valueName: "name",

          issues: [
            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "0",
            }),

            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "1",
            }),
          ],
        },
      )
        .message,
    );

    const namedAsserter = arrayOf(_string, {}, "ArrayOfString");

    assertThrows(
      () => namedAsserter([undefined, undefined]),
      TypeAssertionError,
      new TypeAssertionError(
        namedAsserter.assertedTypeName,
        [undefined, undefined],
        {
          issues: [
            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "0",
            }),

            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "1",
            }),
          ],
        },
      )
        .message,
    );

    const minLengthIssue = `must have a minimum of ${minLength} elements`;
    const maxLengthIssue = `must have a maximum of ${maxLength} elements`;

    const testCases: Array<{
      asserter: TypeAsserter<unknown>;
      values: Array<[value: unknown, issues?: string[]]>;
    }> = [
      {
        asserter: _ArrayOfString,

        values: [
          [undefined],
          [null],
          [false],
          [0],
          [""],
          [{}],

          [[undefined]],
          [[null]],
          [[false]],
          [[0]],
          [[[]]],
          [[{}]],

          [["", undefined]],
        ],
      },

      {
        asserter: _ArrayOfNumber,
        values: [[[undefined]], [[null]], [[false]], [[""]], [[[]]], [[{}]]],
      },

      {
        asserter: _ConstrainedLengthArrayOfString,

        values: [
          [[], [minLengthIssue]],
          [["", "", "", "", "", "", "", "", ""], [maxLengthIssue]],
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
