import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _null } from "./null.ts";

describe("_null", () => {
  it('should have an `assertedTypeName` of `"null"`', () => {
    assertStrictEquals(_null.assertedTypeName, "null");
  });

  it("should return `value` if `null`", () => {
    assertStrictEquals(_null(null), null);
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not `null`", () => {
    assertThrows(
      () => _null(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_null.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _null(undefined),
      TypeAssertionError,
      new TypeAssertionError(_null.assertedTypeName, undefined).message,
    );

    const testCases = [undefined, false, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _null(value),
        TypeAssertionError,
        new TypeAssertionError(_null.assertedTypeName, value).message,
      );
    }
  });
});
