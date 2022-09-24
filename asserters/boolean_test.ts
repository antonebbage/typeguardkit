import { assertStrictEquals, assertThrows } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { _boolean } from "./boolean.ts";

describe("_boolean", () => {
  it('should have a `typeName` of `"boolean"`', () => {
    assertStrictEquals(_boolean.typeName, "boolean");
  });

  it("should return `value` if of type `boolean`", () => {
    const testCases = [false, true];

    for (const value of testCases) {
      assertStrictEquals(_boolean(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `boolean`", () => {
    assertThrows(
      () => _boolean(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _boolean(undefined),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, undefined).message,
    );

    const testCases = [undefined, null, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _boolean(value),
        TypeAssertionError,
        new TypeAssertionError(_boolean.typeName, value).message,
      );
    }
  });
});
