import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { LiteralUnionAsserter } from "./literal_union_asserter.ts";

const literalUnionName = "LiteralUnion";
const literalUnionValues = [0, 1, "", "a"] as const;

const _LiteralUnion = new LiteralUnionAsserter(
  literalUnionName,
  literalUnionValues,
);

describe("LiteralUnionAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _LiteralUnion, typeName: literalUnionName },

      {
        asserter: new LiteralUnionAsserter("", [0, 1]),
        typeName: "UnnamedLiteralUnion",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `values` set to its `values` property", () => {
    assertStrictEquals(_LiteralUnion.values, literalUnionValues);
  });
});

describe("LiteralUnionAsserter.assert", () => {
  it("should return `value` when it is equal to one of the `values`", () => {
    const testCases = [0, 1, "", "a"];

    for (const value of testCases) {
      assertStrictEquals(_LiteralUnion.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not equal to any of the `values`", () => {
    assertThrows(
      () => _LiteralUnion.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = new LiteralUnionAsserter("", [0, 1, "", "a"]);

    assertThrows(
      () => unnamedAsserter.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, [], {}, 2, "b"];

    for (const value of testCases) {
      assertThrows(
        () => _LiteralUnion.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_LiteralUnion.typeName, value).message,
      );
    }
  });
});
