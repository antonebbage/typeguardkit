import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { _string, TypeAssertionError } from "../mod.ts";
import { OptionAsserter } from "./option_asserter.ts";

const optionalStringTypeName = "OptionalString";
const _OptionalString = new OptionAsserter(optionalStringTypeName, _string);

describe("OptionAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _OptionalString, typeName: optionalStringTypeName },
      { asserter: new OptionAsserter("", _string), typeName: "UnnamedOption" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
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

    const unnamedAsserter = new OptionAsserter("", _string);

    assertThrows(
      () => unnamedAsserter.assert(null),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, null).message,
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
