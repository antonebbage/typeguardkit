import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _string, TypeAssertionError } from "../mod.ts";
import { assertIs } from "./assert_is.ts";

describe("assertIs", () => {
  it("should return `undefined` if `asserter` does not throw an error for `value`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(assertIs(_string, value), undefined);
    }
  });

  it("should allow an error thrown by `asserter` for `value` to bubble up", () => {
    assertThrows(
      () => assertIs(_string, undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => assertIs(_string, value),
        TypeAssertionError,
        new TypeAssertionError(_string.assertedTypeName, value).message,
      );
    }
  });
});
