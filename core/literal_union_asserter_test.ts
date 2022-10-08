import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { literalUnionAsserter } from "./literal_union_asserter.ts";

describe("literalUnionAsserter", () => {
  const literalUnionName = "LiteralUnion";

  const _LiteralUnion = literalUnionAsserter(
    literalUnionName,
    [0, 1, "", "a"] as const,
  );

  it("should return a `Function` with the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _LiteralUnion, typeName: literalUnionName },

      {
        asserter: literalUnionAsserter("", [0, 1] as const),
        typeName: "UnnamedLiteralUnion",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is equal to one of the `literals`", () => {
    const testCases = [0, 1, "", "a"];

    for (const value of testCases) {
      assertStrictEquals(_LiteralUnion(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not equal to any of the `literals`", () => {
    assertThrows(
      () => _LiteralUnion(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = literalUnionAsserter("", [0, 1, "", "a"] as const);

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, [], {}, 2, "b"];

    for (const value of testCases) {
      assertThrows(
        () => _LiteralUnion(value),
        TypeAssertionError,
        new TypeAssertionError(_LiteralUnion.typeName, value).message,
      );
    }
  });
});
