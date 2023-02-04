import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _NonNegativeNumber } from "./non_negative_number.ts";

describe("_NonNegativeNumber", () => {
  it('should have a `typeName` of `"NonNegativeNumber"`', () => {
    assertStrictEquals(_NonNegativeNumber.typeName, "NonNegativeNumber");
  });

  it("should return `value` if it is a `number` >= 0", () => {
    const testCases = [0, 0.5, 1, 10, 1000, Infinity];

    for (const value of testCases) {
      assertStrictEquals(_NonNegativeNumber(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` is not a `number` >= 0", () => {
    assertThrows(
      () => _NonNegativeNumber(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_NonNegativeNumber.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _NonNegativeNumber(undefined),
      TypeAssertionError,
      new TypeAssertionError(_NonNegativeNumber.typeName, undefined).message,
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
    ];

    for (const value of testCases) {
      assertThrows(
        () => _NonNegativeNumber(value),
        TypeAssertionError,
        new TypeAssertionError(_NonNegativeNumber.typeName, value).message,
      );
    }
  });
});