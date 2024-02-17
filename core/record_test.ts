import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  LiteralUnionAsserter,
  RecordAsserter,
  TypeAssertionError,
} from "../mod.ts";
import { record } from "./record.ts";

describe("record", () => {
  const _LiteralUnion = new LiteralUnionAsserter(
    "LiteralUnion",
    ["a", "b", "c"],
  );

  const _RecordOfStringByString = record(_string, _string);
  const _RecordOfStringByLiteralUnion = record(_LiteralUnion, _string);
  const _RecordOfNumberByString = record(_string, _number);

  it("should return a `RecordAsserter`", () => {
    assertInstanceOf(_RecordOfStringByString, RecordAsserter);
  });

  it("should return a `RecordAsserter` with the correct `typeName`", () => {
    const testCases = [
      {
        asserter: _RecordOfStringByString,
        typeName: `Record<${_string.typeName}, ${_string.typeName}>`,
      },

      {
        asserter: _RecordOfStringByLiteralUnion,
        typeName: `Record<${_LiteralUnion.typeName}, ${_string.typeName}>`,
      },

      {
        asserter: _RecordOfNumberByString,
        typeName: `Record<${_string.typeName}, ${_number.typeName}>`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `keyAsserter` and `valueAsserter` set to its `keyAsserter` and `valueAsserter` properties", () => {
    const testCases = [
      {
        recordAsserter: _RecordOfStringByString,
        keyAsserter: _string,
        valueAsserter: _string,
      },

      {
        recordAsserter: _RecordOfStringByLiteralUnion,
        keyAsserter: _LiteralUnion,
        valueAsserter: _string,
      },

      {
        recordAsserter: _RecordOfNumberByString,
        keyAsserter: _string,
        valueAsserter: _number,
      },
    ];

    for (const { recordAsserter, keyAsserter, valueAsserter } of testCases) {
      assertStrictEquals(recordAsserter.keyAsserter, keyAsserter);
      assertStrictEquals(recordAsserter.valueAsserter, valueAsserter);
    }
  });

  it("should return a `RecordAsserter` whose `assert` method returns `value` when it is a `Record` where `keyAsserter` and `valueAsserter` do not throw an error for any key or value", () => {
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
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should return a `RecordAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not a `Record` where `keyAsserter` and `valueAsserter` do not throw an error for any key or value", () => {
    assertThrows(
      () =>
        _RecordOfStringByString.assert({ a: undefined, b: undefined }, "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _RecordOfStringByString.typeName,
        { a: undefined, b: undefined },
        {
          valueName: "name",

          issues: [
            new TypeAssertionError(_string.typeName, undefined, {
              valueName: "a",
            }),

            new TypeAssertionError(_string.typeName, undefined, {
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
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
