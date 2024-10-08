import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  _boolean,
  _number,
  _string,
  ObjectAsserter,
  ObjectIntersectionAsserter,
  TypeAssertionError,
  union,
} from "../../mod.ts";
import { objectIntersection } from "./object_intersection.ts";

describe("objectIntersection", () => {
  const objectType1Name = "ObjectType1";

  const _ObjectType1 = new ObjectAsserter(objectType1Name, {
    a: _string,
    b: union(_string, _number),
  });

  const objectType2Name = "ObjectType2";

  const _ObjectType2 = new ObjectAsserter(objectType2Name, {
    a: _string,
    b: union(_string, _boolean),
    c: _string,
  });

  const _Intersection = objectIntersection(_ObjectType1, _ObjectType2);

  it("should return an `ObjectIntersectionAsserter`", () => {
    assertInstanceOf(_Intersection, ObjectIntersectionAsserter);
  });

  it("should return an `ObjectIntersectionAsserter` with the correct `typeName`", () => {
    assertStrictEquals(
      _Intersection.typeName,
      `${_ObjectType1.typeName} & ${_ObjectType2.typeName}`,
    );
  });

  it("should return an `ObjectIntersectionAsserter` whose `assert` method returns `value` when it is an object and none of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { a: "", b: "", c: "" },
      { a: "a", b: "b", c: "c" },
      { a: "", b: "", c: "", d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_Intersection.assert(value), value);
    }
  });

  it("should return an `ObjectIntersectionAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding property of `value`", () => {
    const object = { a: 0, b: 0, c: "" };

    assertThrows(
      () => _Intersection.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _Intersection.propertyAsserters.a.typeName,
            object.a,
            { valueName: ".a" },
          ),

          new TypeAssertionError(
            _Intersection.propertyAsserters.b.typeName,
            object.b,
            { valueName: ".b" },
          ),
        ],
      })
        .message,
    );

    const testCases = [
      { b: "", c: "" },
      { a: 0, b: "", c: "" },
      { a: "", b: false, c: "" },

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
        () => _Intersection.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_Intersection.typeName, value).message,
      );
    }
  });
});
