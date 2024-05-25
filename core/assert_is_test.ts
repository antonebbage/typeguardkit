import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { _string, TypeAssertionError } from "../mod.ts";
import { assertIs } from "./assert_is.ts";

describe("assertIs", () => {
  it("should return `undefined` if `asserter.assert` does not throw an error for `value`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(assertIs(_string, value), undefined);
    }
  });

  it("should allow an error thrown by `asserter.assert` for `value` to bubble up", () => {
    assertThrows(
      () => assertIs(_string, undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => assertIs(_string, value),
        TypeAssertionError,
        new TypeAssertionError(_string.typeName, value).message,
      );
    }
  });
});
