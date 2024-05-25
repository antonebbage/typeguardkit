import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  _boolean,
  _number,
  _string,
  ObjectAsserter,
  TypeAssertionError,
  union,
} from "../../mod.ts";
import { ObjectIntersectionAsserter } from "./object_intersection_asserter.ts";

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

const intersectionName = "Intersection";

const _Intersection = new ObjectIntersectionAsserter(
  intersectionName,
  [_ObjectType1, _ObjectType2],
);

describe("ObjectIntersectionAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _Intersection, typeName: intersectionName },

      {
        asserter: new ObjectIntersectionAsserter(
          "",
          [_ObjectType1, _ObjectType2],
        ),

        typeName: "UnnamedObjectIntersection",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });
});

describe("ObjectIntersectionAsserter.assert", () => {
  it("should return `value` when it is an object and none of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { a: "", b: "", c: "" },
      { a: "a", b: "b", c: "c" },
      { a: "", b: "", c: "", d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_Intersection.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding property of `value`", () => {
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
            { valueName: "a" },
          ),

          new TypeAssertionError(
            _Intersection.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = new ObjectIntersectionAsserter(
      "",
      [_ObjectType1, _ObjectType2],
    );

    assertThrows(
      () => unnamedAsserter.assert(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            _Intersection.propertyAsserters.a.typeName,
            object.a,
            { valueName: "a" },
          ),

          new TypeAssertionError(
            _Intersection.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
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
