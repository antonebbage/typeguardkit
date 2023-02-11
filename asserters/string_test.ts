import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _string } from "./string.ts";

describe("_string", () => {
  it('should have an `assertedTypeName` of `"string"`', () => {
    assertStrictEquals(_string.assertedTypeName, "string");
  });

  it("should return `value` if of type `string`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(_string(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `string`", () => {
    assertThrows(
      () => _string(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _string(undefined),
      TypeAssertionError,
      new TypeAssertionError(_string.assertedTypeName, undefined).message,
    );

    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _string(value),
        TypeAssertionError,
        new TypeAssertionError(_string.assertedTypeName, value).message,
      );
    }
  });
});
