import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  _boolean,
  _number,
  _string,
  Asserted,
  ObjectAsserter,
  TypeAssertionError,
} from "../../mod.ts";
import { PickAsserter } from "./pick_asserter.ts";

const _ObjectType = new ObjectAsserter("ObjectType", {
  a: _string,
  b: _number,
  c: _boolean,
});

const keys: Array<keyof Asserted<typeof _ObjectType>> = ["b", "c"];

const pickedObjectTypeName = "PickedObjectType";

const _PickedObjectType = new PickAsserter(
  pickedObjectTypeName,
  _ObjectType,
  keys,
);

describe("PickAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _PickedObjectType, typeName: pickedObjectTypeName },

      {
        asserter: new PickAsserter("", _ObjectType, keys),
        typeName: "UnnamedPick",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });
});

describe("PickAsserter.assert", () => {
  it("should return `value` when it is an object and none of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { b: 0, c: false },
      { b: 1, c: true },
      { a: "", b: 0, c: false },
      { a: 0, b: 0, c: false },
      { b: 0, c: false, d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_PickedObjectType.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding property of `value`", () => {
    const object = { b: "", c: "" };

    assertThrows(
      () => _PickedObjectType.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PickedObjectType.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
          ),

          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.c.typeName,
            object.c,
            { valueName: "c" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = new PickAsserter("", _ObjectType, keys);

    assertThrows(
      () => unnamedAsserter.assert(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
          ),

          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.c.typeName,
            object.c,
            { valueName: "c" },
          ),
        ],
      })
        .message,
    );

    const testCases = [
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
        () => _PickedObjectType.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_PickedObjectType.typeName, value).message,
      );
    }
  });
});
