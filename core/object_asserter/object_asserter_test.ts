import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { _number, _string, TypeAssertionError } from "../../mod.ts";
import { ObjectAsserter } from "./object_asserter.ts";

const objectTypeName = "ObjectType";

const _ObjectType = new ObjectAsserter(objectTypeName, {
  stringValue: _string,
  numberValue: _number,
});

describe("ObjectAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _ObjectType, typeName: objectTypeName },
      { asserter: new ObjectAsserter("", {}), typeName: "UnnamedObject" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });
});

describe("ObjectAsserter.assert", () => {
  it("should return `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { stringValue: "", numberValue: 0 },
      { stringValue: "a", numberValue: 1 },
      { stringValue: "", numberValue: 0, booleanValue: false },
    ];

    for (const value of testCases) {
      assertStrictEquals(_ObjectType.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` throw an error for the corresponding property of `value`", () => {
    const object = { stringValue: 0, numberValue: "" };

    assertThrows(
      () => _ObjectType.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _ObjectType.propertyAsserters.stringValue.typeName,
            object.stringValue,
            { valueName: "stringValue" },
          ),

          new TypeAssertionError(
            _ObjectType.propertyAsserters.numberValue.typeName,
            object.numberValue,
            { valueName: "numberValue" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = new ObjectAsserter("", {
      stringValue: _string,
      numberValue: _number,
    });

    assertThrows(
      () => unnamedAsserter.assert(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            unnamedAsserter.propertyAsserters.stringValue.typeName,
            object.stringValue,
            { valueName: "stringValue" },
          ),

          new TypeAssertionError(
            unnamedAsserter.propertyAsserters.numberValue.typeName,
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
        () => _ObjectType.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_ObjectType.typeName, value).message,
      );
    }
  });
});
