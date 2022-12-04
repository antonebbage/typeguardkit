import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _PositiveInteger } from "./positive_integer.ts";

describe("_PositiveInteger", () => {
  it('should have a `typeName` of `"PositiveInteger"`', () => {
    assertStrictEquals(_PositiveInteger.typeName, "PositiveInteger");
  });

  it("should return `value` if it is a positive integer `number`", () => {
    const testCases = [1, 10, 1000];

    for (const value of testCases) {
      assertStrictEquals(_PositiveInteger(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` is not a positive integer `number`", () => {
    assertThrows(
      () => _PositiveInteger(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PositiveInteger.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _PositiveInteger(undefined),
      TypeAssertionError,
      new TypeAssertionError(_PositiveInteger.typeName, undefined).message,
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
      -1000,
      -10,
      0,
      0.5,
      Infinity,
    ];

    for (const value of testCases) {
      assertThrows(
        () => _PositiveInteger(value),
        TypeAssertionError,
        new TypeAssertionError(_PositiveInteger.typeName, value).message,
      );
    }
  });
});
