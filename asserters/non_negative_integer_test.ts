import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _NonNegativeInteger } from "./non_negative_integer.ts";

describe("_NonNegativeInteger", () => {
  it('should have a `typeName` of `"NonNegativeInteger"`', () => {
    assertStrictEquals(_NonNegativeInteger.typeName, "NonNegativeInteger");
  });

  it("`assert` should return `value` if it is a non-negative integer `number`", () => {
    const testCases = [0, 1, 10, 1000];

    for (const value of testCases) {
      assertStrictEquals(_NonNegativeInteger.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` is not a non-negative integer `number`", () => {
    assertThrows(
      () => _NonNegativeInteger.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_NonNegativeInteger.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _NonNegativeInteger.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_NonNegativeInteger.typeName, undefined).message,
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
      0.5,
      Infinity,
    ];

    for (const value of testCases) {
      assertThrows(
        () => _NonNegativeInteger.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_NonNegativeInteger.typeName, value).message,
      );
    }
  });
});
