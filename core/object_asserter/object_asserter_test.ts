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
    const object1 = { stringValue: 0, numberValue: "" };

    assertThrows(
      () => _ObjectType.assert(object1, "name"),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, object1, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _ObjectType.propertyAsserters.stringValue.typeName,
            object1.stringValue,
            { valueName: ".stringValue" },
          ),

          new TypeAssertionError(
            _ObjectType.propertyAsserters.numberValue.typeName,
            object1.numberValue,
            { valueName: ".numberValue" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = new ObjectAsserter("", {
      "string-value-1": _string,
      "string value 2": _string,
      "3rdStringValue": _string,
    });

    const object2 = {
      "string-value-1": 0,
      "string value 2": 0,
      "3rdStringValue": 0,
    };

    assertThrows(
      () => unnamedAsserter.assert(object2),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object2, {
        issues: [
          new TypeAssertionError(
            unnamedAsserter.propertyAsserters["string-value-1"].typeName,
            object1.stringValue,
            { valueName: `["string-value-1"]` },
          ),

          new TypeAssertionError(
            unnamedAsserter.propertyAsserters["string value 2"].typeName,
            object1.stringValue,
            { valueName: `["string value 2"]` },
          ),

          new TypeAssertionError(
            unnamedAsserter.propertyAsserters["3rdStringValue"].typeName,
            object1.stringValue,
            { valueName: `["3rdStringValue"]` },
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
