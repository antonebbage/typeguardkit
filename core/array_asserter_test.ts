import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  _number,
  _string,
  array,
  Asserter,
  ObjectAsserter,
  TypeAssertionError,
} from "../mod.ts";
import { ArrayAsserter, ArrayAsserterOptions } from "./array_asserter.ts";

const arrayOfNumberTypeName = "ArrayOfNumber";
const arrayOfNumberOptions: ArrayAsserterOptions<number> = {};

const _ArrayOfNumber = new ArrayAsserter(
  arrayOfNumberTypeName,
  _number,
  arrayOfNumberOptions,
);

const arraySetOfNumberOptions: ArrayAsserterOptions<number> = {
  mustBeASet: true,
};

const _ArraySetOfNumber = new ArrayAsserter(
  "ArraySetOfNumber",
  _number,
  arraySetOfNumberOptions,
);

const _ArraySetOfArray = new ArrayAsserter("ArraySetOfArray", array(_number), {
  mustBeASet: true,
});

const _ObjectType1 = new ObjectAsserter("ObjectType1", {
  a: _number,
  b: _number,
});

const _ObjectType2 = new ObjectAsserter("ObjectType2", {
  a: _ObjectType1,
  b: _ObjectType1,
});

const _ArraySetOfObject = new ArrayAsserter("ArraySetOfObject", _ObjectType2, {
  mustBeASet: true,
});

const constrainedLengthArrayOfStringOptions: ArrayAsserterOptions<string> = {
  minLength: 1,
  maxLength: 8,
};

const _ConstrainedLengthArrayOfString = new ArrayAsserter(
  "ConstrainedLengthArrayOfString",
  _string,
  constrainedLengthArrayOfStringOptions,
);

const ascendingArrayOfNumberIssue = "must be in ascending order";

const ascendingArrayOfNumberOptions: ArrayAsserterOptions<number> = {
  rules: [
    {
      validate(value) {
        for (let i = 1; i < value.length; i++) {
          if (value[i - 1] > value[i]) {
            return false;
          }
        }

        return true;
      },

      requirements: [ascendingArrayOfNumberIssue],
    },
  ],
};

const _AscendingArrayOfNumber = new ArrayAsserter(
  "AscendingArrayOfNumber",
  _number,
  ascendingArrayOfNumberOptions,
);

describe("ArrayAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
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
      { asserter: _ArrayOfNumber, options: arrayOfNumberOptions },
      { asserter: _ArraySetOfNumber, options: arraySetOfNumberOptions },

      {
        asserter: _ConstrainedLengthArrayOfString,
        options: constrainedLengthArrayOfStringOptions,
      },

      {
        asserter: _AscendingArrayOfNumber,
        options: ascendingArrayOfNumberOptions,
      },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.minLength, options.minLength ?? null);
      assertStrictEquals(asserter.maxLength, options.maxLength ?? null);
      assertStrictEquals(asserter.mustBeASet, !!options.mustBeASet);

      if (options.rules) {
        assertStrictEquals(asserter.rules, options.rules);
      } else {
        assertEquals(asserter.rules, []);
      }
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
          new ArrayAsserter("", _string, {
            rules: [{ validate: () => true, requirements }],
          }),
        Error,
        "rule `requirements` must not be empty or contain any blank `string`s",
      );
    }
  });
});

describe("ArrayAsserter.assert", () => {
  it("should return `value` when it is an `Array` where `elementAsserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _ArrayOfNumber, values: [[], [0], [0, 1, 1]] },
      { asserter: _ArraySetOfNumber, values: [[], [0], [0, 1, 2]] },

      {
        asserter: _ArraySetOfArray,

        values: [
          [],
          [[]],
          [[0]],
          [[0], [0, 1]],
          [[0, 1], [1, 0]],
          [[0, 1], [0, 2]],
        ],
      },

      {
        asserter: _ArraySetOfObject,

        values: [
          [],

          [
            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 0 },
            },
          ],

          [
            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 0 },
            },

            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 1 },
            },
          ],

          [
            {
              a: { a: 0, b: 0, c: 0 },
              b: { a: 0, b: 0 },
            },

            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 0 },
            },
          ],

          [
            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 0 },
            },

            {
              a: { a: 0, b: 0 },
              b: { a: 0, b: 0, c: 0 },
            },
          ],
        ],
      },

      {
        asserter: _ConstrainedLengthArrayOfString,
        values: [[""], ["", "", "", "", "", "", "", ""]],
      },

      {
        asserter: _AscendingArrayOfNumber,
        values: [[], [-1], [0], [1], [1, 1], [-2, -1, 0, 1, 1]],
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

    const mustBeASetIssue = "must not have duplicates";

    const testCases: Array<{
      asserter: Asserter<unknown>;
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
        asserter: _ArraySetOfNumber,

        values: [
          [[0, 0], [mustBeASetIssue]],
          [[0, 1, 1], [mustBeASetIssue]],
        ],
      },

      {
        asserter: _ArraySetOfArray,

        values: [
          [[[0, 1], [0, 1]], [mustBeASetIssue]],
          [[[0, 1], [0, 2], [0, 2]], [mustBeASetIssue]],
        ],
      },

      {
        asserter: _ArraySetOfObject,

        values: [
          [
            [
              {
                a: { a: 0, b: 0 },
                b: { a: 0, b: 0 },
              },

              {
                a: { a: 0, b: 0 },
                b: { a: 0, b: 0 },
              },
            ],

            [mustBeASetIssue],
          ],

          [
            [
              {
                a: { a: 0, b: 0 },
                b: { a: 0, b: 0 },
              },

              {
                a: { a: 0, b: 0 },
                b: { b: 0, a: 0 },
              },
            ],

            [mustBeASetIssue],
          ],

          [
            [
              {
                a: { a: 0, b: 0 },
                b: { a: 0, b: 0 },
              },

              {
                a: { a: 1, b: 1 },
                b: { a: 1, b: 1 },
              },

              {
                a: { a: 1, b: 1 },
                b: { a: 1, b: 1 },
              },
            ],

            [mustBeASetIssue],
          ],
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

      {
        asserter: _AscendingArrayOfNumber,

        values: [
          [[1, 0], [ascendingArrayOfNumberIssue]],
          [[0, -1], [ascendingArrayOfNumberIssue]],
          [[-1, 0, 1, 0], [ascendingArrayOfNumberIssue]],
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
