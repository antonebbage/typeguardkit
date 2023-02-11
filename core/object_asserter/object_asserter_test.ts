import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _number, _string, TypeAssertionError } from "../../mod.ts";
import { objectAsserter } from "./object_asserter.ts";

describe("objectAsserter", () => {
  const objectTypeName = "ObjectType";

  const _ObjectType = objectAsserter(objectTypeName, {
    stringValue: _string,
    numberValue: _number,
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _ObjectType, assertedTypeName: objectTypeName },
      { asserter: objectAsserter("", {}), assertedTypeName: "UnnamedObject" },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { stringValue: "", numberValue: 0 },
      { stringValue: "a", numberValue: 1 },
      { stringValue: "", numberValue: 0, booleanValue: false },
    ];

    for (const value of testCases) {
      assertStrictEquals(_ObjectType(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` throw an error for the corresponding property of `value`", () => {
    const object = { stringValue: 0, numberValue: "" };

    assertThrows(
      () => _ObjectType(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.assertedTypeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _ObjectType.propertyAsserters.stringValue.assertedTypeName,
            object.stringValue,
            { valueName: "stringValue" },
          ),

          new TypeAssertionError(
            _ObjectType.propertyAsserters.numberValue.assertedTypeName,
            object.numberValue,
            { valueName: "numberValue" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = objectAsserter("", {
      stringValue: _string,
      numberValue: _number,
    });

    assertThrows(
      () => unnamedAsserter(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.assertedTypeName, object, {
        issues: [
          new TypeAssertionError(
            unnamedAsserter.propertyAsserters.stringValue.assertedTypeName,
            object.stringValue,
            { valueName: "stringValue" },
          ),

          new TypeAssertionError(
            unnamedAsserter.propertyAsserters.numberValue.assertedTypeName,
            object.numberValue,
            { valueName: "numberValue" },
          ),
        ],
      })
        .message,
    );

    const testCases = [
      { s: "", number: 0 },

      undefined,
      null,
      false,
      0,
      "",
      [],
      {},
    ];

    for (const value of testCases) {
      assertThrows(
        () => _ObjectType(value),
        TypeAssertionError,
        new TypeAssertionError(_ObjectType.assertedTypeName, value).message,
      );
    }
  });
});
