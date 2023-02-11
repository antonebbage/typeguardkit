import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _Integer } from "./integer.ts";

describe("_Integer", () => {
  it('should have an `assertedTypeName` of `"Integer"`', () => {
    assertStrictEquals(_Integer.assertedTypeName, "Integer");
  });

  it("should return `value` if it is an integer `number`", () => {
    const testCases = [-1000, -10, -1, 0, 1, 10, 1000];

    for (const value of testCases) {
      assertStrictEquals(_Integer(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` is not an integer `number`", () => {
    assertThrows(
      () => _Integer(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_Integer.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _Integer(undefined),
      TypeAssertionError,
      new TypeAssertionError(_Integer.assertedTypeName, undefined).message,
    );

    const testCases = [
      undefined,
      null,
      false,
      "",
      [],
      {},

      NaN,
      -Infinity,
      -0.5,
      0.5,
      Infinity,
    ];

    for (const value of testCases) {
      assertThrows(
        () => _Integer(value),
        TypeAssertionError,
        new TypeAssertionError(_Integer.assertedTypeName, value).message,
      );
    }
  });
});
