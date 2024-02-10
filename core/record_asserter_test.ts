import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  LiteralUnionAsserter,
  TypeAssertionError,
} from "../mod.ts";
import { RecordAsserter } from "./record_asserter.ts";

const _LiteralUnion = new LiteralUnionAsserter("LiteralUnion", ["a", "b", "c"]);

const recordOfStringByStringTypeName = "RecordOfStringByString";

const _RecordOfStringByString = new RecordAsserter(
  recordOfStringByStringTypeName,
  [_string, _string],
);

const recordOfStringByLiteralUnionTypeName = "RecordOfStringByLiteralUnion";

const _RecordOfStringByLiteralUnion = new RecordAsserter(
  recordOfStringByLiteralUnionTypeName,
  [_LiteralUnion, _string],
);

const recordOfNumberByStringTypeName = "RecordOfNumberByString";

const _RecordOfNumberByString = new RecordAsserter(
  recordOfNumberByStringTypeName,
  [_string, _number],
);

describe("RecordAsserter", () => {
  it("should have the provided `typeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: _RecordOfStringByString,
        typeName: recordOfStringByStringTypeName,
      },

      {
        asserter: _RecordOfStringByLiteralUnion,
        typeName: recordOfStringByLiteralUnionTypeName,
      },

      {
        asserter: _RecordOfNumberByString,
        typeName: recordOfNumberByStringTypeName,
      },

      {
        asserter: new RecordAsserter("", [_string, _string]),
        typeName: "UnnamedRecord",
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
});

describe("RecordAsserter.assert", () => {
  it("should return `value` when it is a `Record` where `keyAsserter` and `valueAsserter` do not throw an error for any key or value", () => {
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

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not a `Record` where `keyAsserter` and `valueAsserter` do not throw an error for any key or value", () => {
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

    const unnamedAsserter = new RecordAsserter("", [_string, _string]);

    assertThrows(
      () => unnamedAsserter.assert({ a: undefined, b: undefined }),
      TypeAssertionError,
      new TypeAssertionError(
        unnamedAsserter.typeName,
        { a: undefined, b: undefined },
        {
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
