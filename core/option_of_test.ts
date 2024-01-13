import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { _string, TypeAssertionError } from "../mod.ts";
import { optionOf } from "./option_of.ts";

describe("optionOf", () => {
  const _OptionalString = optionOf(_string);

  it("should return a `Function`", () => {
    assertInstanceOf(_OptionalString, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(_OptionalString.asserterTypeName, "OptionAsserter");
  });

  it("should return a `Function` with the correct `assertedTypeName`", () => {
    assertStrictEquals(
      _OptionalString.assertedTypeName,
      `${_string.assertedTypeName} | undefined`,
    );
  });

  it("should return a `Function` with the provided `definedTypeAsserter` set to its `definedTypeAsserter` property", () => {
    assertStrictEquals(_OptionalString.definedTypeAsserter, _string);
  });

  it("should return a `Function` that returns `value` when `undefined` or `definedTypeAsserter` does not throw an error for it", () => {
    const testCases = ["", "a", undefined];

    for (const value of testCases) {
      assertStrictEquals(_OptionalString(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` defined and `definedTypeAsserter` throws an error for it", () => {
    assertThrows(
      () => _OptionalString(null, "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _OptionalString.assertedTypeName,
        null,
        { valueName: "name" },
      )
        .message,
    );

    const testCases = [null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _OptionalString(value),
        TypeAssertionError,
        new TypeAssertionError(_OptionalString.assertedTypeName, value).message,
      );
    }
  });
});
