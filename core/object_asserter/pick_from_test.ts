import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import {
  _boolean,
  _number,
  _string,
  objectAsserter,
  objectAsserterTypeName,
  TypeAssertionError,
} from "../../mod.ts";
import { pickFrom } from "./pick_from.ts";

describe("pickFrom", () => {
  const _ObjectType = objectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const keys: Array<keyof ReturnType<typeof _ObjectType>> = ["b", "c"];

  const _PickedObjectType = pickFrom(_ObjectType, keys);

  it("should return a `Function`", () => {
    assertInstanceOf(_PickedObjectType, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(
      _PickedObjectType.asserterTypeName,
      objectAsserterTypeName,
    );
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if `undefined` or empty", () => {
    const defaultTypeName = `Pick<${_ObjectType.assertedTypeName}, "b" | "c">`;

    const testCases = [
      {
        asserter: pickFrom(_ObjectType, ["a"], "PickedObjectType"),
        assertedTypeName: "PickedObjectType",
      },

      {
        asserter: _PickedObjectType,
        assertedTypeName: defaultTypeName,
      },

      {
        asserter: pickFrom(_ObjectType, keys, ""),
        assertedTypeName: defaultTypeName,
      },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` that returns `value` when it is an object and none of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { b: 0, c: false },
      { b: 1, c: true },
      { a: "", b: 0, c: false },
      { a: 0, b: 0, c: false },
      { b: 0, c: false, d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_PickedObjectType(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding property of `value`", () => {
    const object = { b: "", c: "" };

    assertThrows(
      () => _PickedObjectType(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PickedObjectType.assertedTypeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.b.assertedTypeName,
            object.b,
            { valueName: "b" },
          ),

          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.c.assertedTypeName,
            object.c,
            { valueName: "c" },
          ),
        ],
      })
        .message,
    );

    const namedAsserter = pickFrom(_ObjectType, keys, "PickedObjectType");

    assertThrows(
      () => namedAsserter(object),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.assertedTypeName, object, {
        issues: [
          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.b.assertedTypeName,
            object.b,
            { valueName: "b" },
          ),

          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.c.assertedTypeName,
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
        () => _PickedObjectType(value),
        TypeAssertionError,
        new TypeAssertionError(_PickedObjectType.assertedTypeName, value)
          .message,
      );
    }
  });
});
