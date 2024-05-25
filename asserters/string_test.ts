import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { _string } from "./string.ts";

describe("_string", () => {
  it('should have a `typeName` of `"string"`', () => {
    assertStrictEquals(_string.typeName, "string");
  });

  it("`assert` should return `value` if of type `string`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(_string.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` not of type `string`", () => {
    assertThrows(
      () => _string.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => _string.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _string.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_string.typeName, value).message,
      );
    }
  });
});
