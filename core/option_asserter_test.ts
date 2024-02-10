import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { _string, TypeAssertionError } from "../mod.ts";
import { OptionAsserter } from "./option_asserter.ts";

const _OptionalString = new OptionAsserter(_string);

describe("OptionAsserter", () => {
  it("should have the correct `typeName`", () => {
    assertStrictEquals(
      _OptionalString.typeName,
      `${_string.typeName} | undefined`,
    );
  });

  it("should have the provided `definedTypeAsserter` set to its `definedTypeAsserter` property", () => {
    assertStrictEquals(_OptionalString.definedTypeAsserter, _string);
  });
});

describe("OptionAsserter.assert", () => {
  it("should return `value` when `undefined` or `definedTypeAsserter` does not throw an error for it", () => {
    const testCases = ["", "a", undefined];

    for (const value of testCases) {
      assertStrictEquals(_OptionalString.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` defined and `definedTypeAsserter` throws an error for it", () => {
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
