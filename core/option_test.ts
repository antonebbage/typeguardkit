import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { _string, OptionAsserter, TypeAssertionError } from "../mod.ts";
import { option } from "./option.ts";

describe("option", () => {
  const _OptionalString = option(_string);

  it("should return an `OptionAsserter`", () => {
    assertInstanceOf(_OptionalString, OptionAsserter);
  });

  it("should return an `OptionAsserter` with the correct `typeName`", () => {
    assertStrictEquals(
      _OptionalString.typeName,
      `${_string.typeName} | undefined`,
    );
  });

  it("should return an `OptionAsserter` with the provided `definedTypeAsserter` set to its `definedTypeAsserter` property", () => {
    assertStrictEquals(_OptionalString.definedTypeAsserter, _string);
  });

  it("should return an `OptionAsserter` whose `assert` method returns `value` when `undefined` or `definedTypeAsserter` does not throw an error for it", () => {
    const testCases = ["", "a", undefined];

    for (const value of testCases) {
      assertStrictEquals(_OptionalString.assert(value), value);
    }
  });

  it("should return an `OptionAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` defined and `definedTypeAsserter` throws an error for it", () => {
    assertThrows(
      () => _OptionalString.assert(null, "name"),
      TypeAssertionError,
      new TypeAssertionError(_OptionalString.typeName, null, {
        valueName: "name",
      })
        .message,
    );

    const testCases = [null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _OptionalString.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_OptionalString.typeName, value).message,
      );
    }
  });
});
