import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  literalUnionAsserter,
  TypeAssertionError,
} from "../mod.ts";
import { recordOf } from "./record_of.ts";

describe("recordOf", () => {
  const _LiteralUnion = literalUnionAsserter(
    "LiteralUnion",
    ["a", "b", "c"] as const,
  );

  const _recordOfStringByString = recordOf(_string, _string);
  const _recordOfStringByLiteralUnion = recordOf(_LiteralUnion, _string);
  const _recordOfNumberByString = recordOf(_string, _number);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: recordOf(_string, _string, "RecordOfStringByString"),
        typeName: "RecordOfStringByString",
      },

      {
        asserter: _recordOfStringByString,
        typeName: `Record<${_string.typeName}, ${_string.typeName}>`,
      },

      {
        asserter: _recordOfStringByLiteralUnion,
        typeName: `Record<${_LiteralUnion.typeName}, ${_string.typeName}>`,
      },

      {
        asserter: _recordOfNumberByString,
        typeName: `Record<${_string.typeName}, ${_number.typeName}>`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is a `Record` where `asserter` does not throw an error for any key or value", () => {
    const testCases = [
      {
        asserter: _recordOfStringByString,
        values: [{}, { "": "" }, { a: "a", b: "b", c: "c" }],
      },

      {
        asserter: _recordOfStringByLiteralUnion,
        values: [{ a: "a", b: "b", c: "c" }],
      },

      {
        asserter: _recordOfNumberByString,
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
      () => _recordOfStringByString({ a: undefined, b: undefined }, "name"),
      TypeAssertionError,
      new TypeAssertionError(_recordOfStringByString.typeName, {
        a: undefined,
        b: undefined,
      }, {
        valueName: "name",

        issues: [
          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "a",
          }),

          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "b",
          }),
        ],
      })
        .message,
    );

    const namedAsserter = recordOf(_string, _string, "RecordOfStringByString");

    assertThrows(
      () => namedAsserter({ a: undefined, b: undefined }),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.typeName, {
        a: undefined,
        b: undefined,
      }, {
        issues: [
          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "a",
          }),

          new TypeAssertionError(_string.typeName, undefined, {
            valueName: "b",
          }),
        ],
      })
        .message,
    );

    const testCases = [
      {
        asserter: _recordOfStringByString,

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
        asserter: _recordOfStringByLiteralUnion,

        values: [
          {},
          { a: "", b: "" },

          { a: "", b: "", c: "", d: "" },

          { a: "", b: "", c: 0 },
        ],
      },

      {
        asserter: _recordOfNumberByString,

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
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
