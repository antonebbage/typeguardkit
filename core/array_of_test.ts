import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _number, _string, TypeAssertionError } from "../mod.ts";
import { arrayOf } from "./array_of.ts";

describe("arrayOf", () => {
  const _ArrayOfString = arrayOf(_string);
  const _ArrayOfNumber = arrayOf(_number);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: arrayOf(_string, "ArrayOfString"),
        typeName: "ArrayOfString",
      },

      {
        asserter: _ArrayOfString,
        typeName: `Array<${_string.typeName}>`,
      },

      {
        asserter: _ArrayOfNumber,
        typeName: `Array<${_number.typeName}>`,
      },

      {
        asserter: arrayOf(_string, ""),
        typeName: `Array<${_string.typeName}>`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is an `Array` where `asserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _ArrayOfString, values: [[], [""], ["a", "b", "c"]] },
      { asserter: _ArrayOfNumber, values: [[], [0], [0, 1, 2]] },
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
      new TypeAssertionError(_ArrayOfString.typeName, [undefined, undefined], {
        valueName: "name",

        issues: [
          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "0",
          }),

          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "1",
          }),
        ],
      })
        .message,
    );

    const namedAsserter = arrayOf(_string, "ArrayOfString");

    assertThrows(
      () => namedAsserter([undefined, undefined]),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.typeName, [undefined, undefined], {
        issues: [
          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "0",
          }),

          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "1",
          }),
        ],
      })
        .message,
    );

    const testCases = [
      {
        asserter: _ArrayOfString,

        values: [
          undefined,
          null,
          false,
          0,
          "",
          {},

          [undefined],
          [null],
          [false],
          [0],
          [[]],
          [{}],

          ["", undefined],
        ],
      },

      {
        asserter: _ArrayOfNumber,
        values: [[undefined], [null], [false], [""], [[]], [{}]],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertThrows(
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
