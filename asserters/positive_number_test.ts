import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _PositiveNumber } from "./positive_number.ts";

describe("_PositiveNumber", () => {
  it('should have a `typeName` of `"PositiveNumber"`', () => {
    assertStrictEquals(_PositiveNumber.typeName, "PositiveNumber");
  });

  it("`assert` should return `value` if it is a `number` > 0", () => {
    const testCases = [0.5, 1, 10, 1000, Infinity];

    for (const value of testCases) {
      assertStrictEquals(_PositiveNumber.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` is not a `number` > 0", () => {
    assertThrows(
      () => _PositiveNumber.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PositiveNumber.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _PositiveNumber.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_PositiveNumber.typeName, undefined).message,
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
    ];

    for (const value of testCases) {
      assertThrows(
        () => _PositiveNumber.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_PositiveNumber.typeName, value).message,
      );
    }
  });
});
