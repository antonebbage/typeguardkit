import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  literalUnionAsserter,
  typeAsserterTypeName,
  TypeAssertionError,
} from "../mod.ts";
import { recordOf } from "./record_of.ts";

describe("recordOf", () => {
  const _LiteralUnion = literalUnionAsserter("LiteralUnion", ["a", "b", "c"]);

  const _RecordOfStringByString = recordOf(_string, _string);
  const _RecordOfStringByLiteralUnion = recordOf(_LiteralUnion, _string);
  const _RecordOfNumberByString = recordOf(_string, _number);

  it("should return a `Function`", () => {
    assertInstanceOf(_RecordOfStringByString, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(
      _RecordOfStringByString.asserterTypeName,
      typeAsserterTypeName,
    );
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: recordOf(_string, _string, "RecordOfStringByString"),
        assertedTypeName: "RecordOfStringByString",
      },

      {
        asserter: _RecordOfStringByString,

        assertedTypeName:
          `Record<${_string.assertedTypeName}, ${_string.assertedTypeName}>`,
      },

      {
        asserter: _RecordOfStringByLiteralUnion,

        assertedTypeName:
          `Record<${_LiteralUnion.assertedTypeName}, ${_string.assertedTypeName}>`,
      },

      {
        asserter: _RecordOfNumberByString,

        assertedTypeName:
          `Record<${_string.assertedTypeName}, ${_number.assertedTypeName}>`,
      },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` that returns `value` when it is a `Record` where `asserter` does not throw an error for any key or value", () => {
    const testCases = [
      {
        asserter: _RecordOfStringByString,
        values: [{}, { "": "" }, { a: "a", b: "b", c: "c" }],
      },

      {
        asserter: _RecordOfStringByLiteralUnion,
        values: [{ a: "a", b: "b", c: "c" }],
      },

      {
        asserter: _RecordOfNumberByString,
        values: [{}, { "": 0 }, { a: 1, b: 2, c: 3 }],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not a `Record` where `asserter` does not throw an error for any key or value", () => {
    assertThrows(
      () => _RecordOfStringByString({ a: undefined, b: undefined }, "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _RecordOfStringByString.assertedTypeName,
        { a: undefined, b: undefined },
        {
          valueName: "name",

          issues: [
            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "a",
            }),

            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "b",
            }),
          ],
        },
      )
        .message,
    );

    const namedAsserter = recordOf(_string, _string, "RecordOfStringByString");

    assertThrows(
      () => namedAsserter({ a: undefined, b: undefined }),
      TypeAssertionError,
      new TypeAssertionError(
        namedAsserter.assertedTypeName,
        { a: undefined, b: undefined },
        {
          issues: [
            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "a",
            }),

            new TypeAssertionError(_string.assertedTypeName, undefined, {
              valueName: "b",
            }),
          ],
        },
      )
        .message,
    );

    const testCases = [
      {
        asserter: _RecordOfStringByString,

        values: [
          undefined,
          null,
          false,
          0,
          "",
          [],

          { a: undefined },
          { a: null },
          { a: false },
          { a: 0 },
          { a: [] },
          { a: {} },

          { a: "", b: undefined },
        ],
      },

      {
        asserter: _RecordOfStringByLiteralUnion,

        values: [
          {},
          { a: "", b: "" },

          { a: "", b: "", c: "", d: "" },

          { a: "", b: "", c: 0 },
        ],
      },

      {
        asserter: _RecordOfNumberByString,

        values: [
          { a: undefined },
          { a: null },
          { a: false },
          { a: "" },
          { a: [] },
          { a: {} },

          { a: 0, b: undefined },
        ],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertThrows(
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.assertedTypeName, value).message,
        );
      }
    }
  });
});
