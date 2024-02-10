import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { _number, _string, TypeAssertionError } from "../mod.ts";
import { ArrayAsserter, ArrayAsserterOptions } from "./array_asserter.ts";

const arrayOfNumberTypeName = "ArrayOfNumber";
const _ArrayOfNumber = new ArrayAsserter(arrayOfNumberTypeName, _number, {});

const constrainedLengthArrayOfStringTypeName = "ConstrainedLengthArrayOfString";

const constrainedLengthArrayOfStringOptions: ArrayAsserterOptions = {
  minLength: 1,
  maxLength: 8,
};

const _ConstrainedLengthArrayOfString = new ArrayAsserter(
  constrainedLengthArrayOfStringTypeName,
  _string,
  constrainedLengthArrayOfStringOptions,
);

describe("ArrayAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      {
        asserter: _ConstrainedLengthArrayOfString,
        typeName: constrainedLengthArrayOfStringTypeName,
      },

      { asserter: _ArrayOfNumber, typeName: arrayOfNumberTypeName },

      {
        asserter: new ArrayAsserter("", _string, {}),
        typeName: `UnnamedArray`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `elementAsserter` set to its `elementAsserter` property", () => {
    const testCases = [
      { arrayAsserter: _ArrayOfNumber, elementAsserter: _number },

      {
        arrayAsserter: _ConstrainedLengthArrayOfString,
        elementAsserter: _string,
      },
    ];

    for (const { arrayAsserter, elementAsserter } of testCases) {
      assertStrictEquals(arrayAsserter.elementAsserter, elementAsserter);
    }
  });

  it("should have the provided `ArrayAsserterOptions` or correct defaults as properties", () => {
    const testCases = [
      { asserter: _ArrayOfNumber, options: {} as ArrayAsserterOptions },

      {
        asserter: _ConstrainedLengthArrayOfString,
        options: constrainedLengthArrayOfStringOptions,
      },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.minLength, options.minLength);
      assertStrictEquals(asserter.maxLength, options.maxLength);
    }
  });

  it("should throw an `Error` with correct `message` if `minLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const minLength of testCases) {
      assertThrows(
        () => new ArrayAsserter("", _string, { minLength }),
        Error,
        "`minLength` must be a positive integer if defined",
      );
    }
  });

  it("should throw an `Error` with correct `message` if `maxLength` is defined but not a positive integer", () => {
    const testCases = [-Infinity, -1000, -1, -0.5, 0, 0.5];

    for (const maxLength of testCases) {
      assertThrows(
        () => new ArrayAsserter("", _string, { maxLength }),
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
        () => new ArrayAsserter("", _string, { minLength, maxLength }).assert,
        Error,
        "`minLength` must be <= `maxLength` if both are defined",
      );
    }
  });
});

describe("ArrayAsserter.assert", () => {
  it("should return `value` when it is an `Array` where `elementAsserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _ArrayOfNumber, values: [[], [0], [0, 1, 2]] },

      {
        asserter: _ConstrainedLengthArrayOfString,
        values: [[""], ["", "", "", "", "", "", "", ""]],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not an `Array` where `elementAsserter` does not throw an error for any element", () => {
    assertThrows(
      () => _ArrayOfNumber.assert([undefined, undefined], "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _ArrayOfNumber.typeName,
        [undefined, undefined],
        {
          valueName: "name",

          issues: [
            new TypeAssertionError(_number.typeName, undefined, {
              valueName: "0",
            }),

            new TypeAssertionError(_number.typeName, undefined, {
              valueName: "1",
            }),
          ],
        },
      )
        .message,
    );

    const unnamedAsserter = new ArrayAsserter("", _string, {});

    assertThrows(
      () => unnamedAsserter.assert([undefined, undefined]),
      TypeAssertionError,
      new TypeAssertionError(
        unnamedAsserter.typeName,
        [undefined, undefined],
        {
          issues: [
            new TypeAssertionError(_string.typeName, undefined, {
              valueName: "0",
            }),

            new TypeAssertionError(_string.typeName, undefined, {
              valueName: "1",
            }),
          ],
        },
      )
        .message,
    );

    const testCases: Array<{
      asserter: ArrayAsserter<unknown>;
      values: Array<[value: unknown, issues?: string[]]>;
    }> = [
      {
        asserter: _ArrayOfNumber,

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
          [[""]],
          [[[]]],
          [[{}]],

          [["", undefined]],
        ],
      },

      {
        asserter: _ConstrainedLengthArrayOfString,

        values: [
          [[], [
            `must have a minimum of ${_ConstrainedLengthArrayOfString.minLength}`,
          ]],

          [["", "", "", "", "", "", "", "", ""], [
            `must have a maximum of ${_ConstrainedLengthArrayOfString.maxLength}`,
          ]],
        ],
      },

      {
        asserter: new ArrayAsserter("", _string, {
          minLength: 1,
          maxLength: 1,
        }),

        values: [[[], ["must have 1"]], [["", ""], ["must have 1"]]],
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
