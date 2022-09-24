import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _number } from "./number.ts";

describe("_number", () => {
  it('should have a `typeName` of `"number"`', () => {
    assertStrictEquals(_number.typeName, "number");
  });

  it("should return `value` if of type `number`", () => {
    const testCases = [0, 1];

    for (const value of testCases) {
      assertStrictEquals(_number(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `number`", () => {
    assertThrows(
      () => _number(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => _number(undefined),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _number(value),
        TypeAssertionError,
        new TypeAssertionError(_number.typeName, value).message,
      );
    }
  });
});