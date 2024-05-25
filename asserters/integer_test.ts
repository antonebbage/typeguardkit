import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { _Integer } from "./integer.ts";

describe("_Integer", () => {
  it('should have a `typeName` of `"Integer"`', () => {
    assertStrictEquals(_Integer.typeName, "Integer");
  });

  it("`assert` should return `value` if it is an integer `number`", () => {
    const testCases = [-1000, -10, -1, 0, 1, 10, 1000];

    for (const value of testCases) {
      assertStrictEquals(_Integer.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` is not an integer `number`", () => {
    assertThrows(
      () => _Integer.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_Integer.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _Integer.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_Integer.typeName, undefined).message,
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
        () => _Integer.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_Integer.typeName, value).message,
      );
    }
  });
});
