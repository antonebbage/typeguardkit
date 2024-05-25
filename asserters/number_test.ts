import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { _number } from "./number.ts";

describe("_number", () => {
  it('should have a `typeName` of `"number"`', () => {
    assertStrictEquals(_number.typeName, "number");
  });

  it("`assert` should return `value` if of type `number`", () => {
    const testCases = [0, 1];

    for (const value of testCases) {
      assertStrictEquals(_number.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` not of type `number`", () => {
    assertThrows(
      () => _number.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => _number.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _number.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_number.typeName, value).message,
      );
    }
  });
});
