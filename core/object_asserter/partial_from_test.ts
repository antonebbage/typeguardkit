import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _boolean,
  _number,
  _string,
  ObjectAsserter,
  OptionAsserter,
  TypeAssertionError,
} from "../../mod.ts";
import { partialFrom } from "./partial_from.ts";

describe("partialFrom", () => {
  const _ObjectType = new ObjectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const _PartialObjectType = partialFrom(_ObjectType);

  it("should return an `ObjectAsserter`", () => {
    assertInstanceOf(_PartialObjectType, ObjectAsserter);
  });

  it("should return an `ObjectAsserter` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const defaultTypeName = `Partial<${_ObjectType.typeName}>`;

    const testCases = [
      {
        asserter: partialFrom(_ObjectType, "PartialObjectType"),
        typeName: "PartialObjectType",
      },

      { asserter: _PartialObjectType, typeName: defaultTypeName },
      { asserter: partialFrom(_ObjectType, ""), typeName: defaultTypeName },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return an `ObjectAsserter` whose `propertyAsserters` are all the correct type", () => {
    for (
      const asserter of Object.values(_PartialObjectType.propertyAsserters)
    ) {
      assertInstanceOf(asserter, OptionAsserter);
    }
  });

  it("should return an `ObjectAsserter` whose `assert` method returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value` when not `undefined`", () => {
    const testCases = [
      { a: "", b: 0, c: false },
      { a: "a", b: 1, c: true },
      {},
      { a: undefined, b: undefined, c: undefined },
      { a: "", b: 0, c: false, d: "" },
      { d: "" },
      [],
    ];

    for (const value of testCases) {
      assertStrictEquals(_PartialObjectType.assert(value), value);
    }
  });

  it("should return an `ObjectAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` throw an error for the corresponding property of `value` when not `undefined`", () => {
    const object = { a: 0, b: "", c: false };

    assertThrows(
      () => _PartialObjectType.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PartialObjectType.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _PartialObjectType.propertyAsserters.a.typeName,
            object.a,
            { valueName: "a" },
          ),

          new TypeAssertionError(
            _PartialObjectType.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
          ),
        ],
      })
        .message,
    );

    const namedAsserter = partialFrom(_ObjectType, "PartialObjectType");

    assertThrows(
      () => namedAsserter.assert(object),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            _PartialObjectType.propertyAsserters.a.typeName,
            object.a,
            { valueName: "a" },
          ),

          new TypeAssertionError(
            _PartialObjectType.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
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
    ];

    for (const value of testCases) {
      assertThrows(
        () => _PartialObjectType.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_PartialObjectType.typeName, value).message,
      );
    }
  });
});
