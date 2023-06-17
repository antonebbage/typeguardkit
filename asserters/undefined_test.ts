import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _undefined } from "./undefined.ts";

describe("_undefined", () => {
  it('should have an `assertedTypeName` of `"undefined"`', () => {
    assertStrictEquals(_undefined.assertedTypeName, "undefined");
  });

  it("should return `value` if `undefined`", () => {
    assertStrictEquals(_undefined(undefined), undefined);
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not `undefined`", () => {
    assertThrows(
      () => _undefined(null, "name"),
      TypeAssertionError,
      new TypeAssertionError(_undefined.assertedTypeName, null, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _undefined(null),
      TypeAssertionError,
      new TypeAssertionError(_undefined.assertedTypeName, null).message,
    );

    const testCases = [null, false, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _undefined(value),
        TypeAssertionError,
        new TypeAssertionError(_undefined.assertedTypeName, value).message,
      );
    }
  });
});
