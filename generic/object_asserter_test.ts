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
  TypeAssertionError,
  unionOf,
} from "../mod.ts";
import { objectAsserter, objectIntersectionOf } from "./object_asserter.ts";

describe("objectAsserter", () => {
  const objectTypeName = "ObjectType";

  const _ObjectType = objectAsserter(objectTypeName, {
    string: _string,
    number: _number,
  });

  it("should return a `Function` with the provided `typeName`", () => {
    assertInstanceOf(_ObjectType, Function);
    assertStrictEquals(_ObjectType.typeName, objectTypeName);
  });

  it(
    "should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value`",
    () => {
      const testCases = [
        { string: "", number: 0 },
        { string: "a", number: 1 },
        { string: "", number: 0, boolean: false },
      ];

      for (const value of testCases) {
        assertStrictEquals(_ObjectType(value), value);
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` throw an error for the corresponding property of `value`", () => {
    const object = { string: 0, number: 0 };

    assertThrows(
      () => _ObjectType(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, object, {
        valueName: "name",
        innerError: new TypeAssertionError(
          _ObjectType.propertyAsserters.string.typeName,
          object.number,
          { valueName: '["string"]' },
        ),
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
        new TypeAssertionError(_ObjectType.typeName, value).message,
      );
    }
  });
});

describe("objectIntersectionOf", () => {
  const objectType1Name = "ObjectType1";

  const _ObjectType1 = objectAsserter(objectType1Name, {
    a: _string,
    b: unionOf(_string, _number),
  });

  const objectType2Name = "ObjectType2";

  const _ObjectType2 = objectAsserter(objectType2Name, {
    a: _string,
    b: unionOf(_string, _boolean),
    c: _string,
  });

  const intersectionName = "Intersection";

  const _Intersection = objectIntersectionOf(
    _ObjectType1,
    _ObjectType2,
    intersectionName,
  );

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined`", () => {
    assertInstanceOf(_Intersection, Function);

    assertStrictEquals(_Intersection.typeName, intersectionName);

    assertStrictEquals(
      objectIntersectionOf(_ObjectType1, _ObjectType2).typeName,
      `${_ObjectType1.typeName} & ${_ObjectType2.typeName}`,
    );
  });

  it(
    "should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding properties of `value`",
    () => {
      const testCases = [
        { a: "", b: "", c: "" },
        { a: "a", b: "b", c: "c" },
        { a: "", b: "", c: "", d: "" },
      ];

      for (const value of testCases) {
        assertStrictEquals(_Intersection(value), value);
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding property of `value`", () => {
    const object = { a: "", b: 0, c: "" };

    assertThrows(
      () => _Intersection(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object, {
        valueName: "name",
        innerError: new TypeAssertionError(
          _Intersection.propertyAsserters.b.typeName,
          object.b,
          { valueName: '["b"]' },
        ),
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
