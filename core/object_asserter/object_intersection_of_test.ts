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
  TypeAssertionError,
  unionOf,
} from "../../mod.ts";
import { objectIntersectionOf } from "./object_intersection_of.ts";

describe("objectIntersectionOf", () => {
  const objectType1Name = "ObjectType1";

  const _ObjectType1 = objectAsserter(objectType1Name, {
    a: _string,
    b: unionOf([_string, _number]),
  });

  const objectType2Name = "ObjectType2";

  const _ObjectType2 = objectAsserter(objectType2Name, {
    a: _string,
    b: unionOf([_string, _boolean]),
    c: _string,
  });

  const intersectionName = "Intersection";

  const _Intersection = objectIntersectionOf(
    _ObjectType1,
    _ObjectType2,
    intersectionName,
  );

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const defaultTypeName =
      `${_ObjectType1.typeName} & ${_ObjectType2.typeName}`;

    const testCases = [
      {
        asserter: _Intersection,
        typeName: intersectionName,
      },
      {
        asserter: objectIntersectionOf(_ObjectType1, _ObjectType2),
        typeName: defaultTypeName,
      },
      {
        asserter: objectIntersectionOf(_ObjectType1, _ObjectType2, ""),
        typeName: defaultTypeName,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { a: "", b: "", c: "" },
      { a: "a", b: "b", c: "c" },
      { a: "", b: "", c: "", d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_Intersection(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding property of `value`", () => {
    const object = { a: 0, b: 0, c: "" };

    assertThrows(
      () => _Intersection(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _Intersection.propertyAsserters.a.typeName,
            object.a,
            { valueName: '["a"]' },
          ),
          new TypeAssertionError(
            _Intersection.propertyAsserters.b.typeName,
            object.b,
            { valueName: '["b"]' },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = objectIntersectionOf(_ObjectType1, _ObjectType2);

    assertThrows(
      () => unnamedAsserter(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            _Intersection.propertyAsserters.a.typeName,
            object.a,
            { valueName: '["a"]' },
          ),
          new TypeAssertionError(
            _Intersection.propertyAsserters.b.typeName,
            object.b,
            { valueName: '["b"]' },
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
        () => _Intersection(value),
        TypeAssertionError,
        new TypeAssertionError(_Intersection.typeName, value).message,
      );
    }
  });
});
