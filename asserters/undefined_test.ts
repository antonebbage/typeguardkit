import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { _undefined } from "./undefined.ts";

describe("_undefined", () => {
  it('should have a `typeName` of `"undefined"`', () => {
    assertStrictEquals(_undefined.typeName, "undefined");
  });

  it("`assert` should return `value` if `undefined`", () => {
    assertStrictEquals(_undefined.assert(undefined), undefined);
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` not `undefined`", () => {
    assertThrows(
      () => _undefined.assert(null, "name"),
      TypeAssertionError,
      new TypeAssertionError(_undefined.typeName, null, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => _undefined.assert(null),
      TypeAssertionError,
      new TypeAssertionError(_undefined.typeName, null).message,
    );

    const testCases = [null, false, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _undefined.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_undefined.typeName, value).message,
      );
    }
  });
});
