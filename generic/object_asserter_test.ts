import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
  describe,
  it,
} from "/dev_deps.ts";
import {
  _boolean,
  _number,
  _string,
  objectAsserter,
  objectIntersectionOf,
  TypeAssertionError,
  unionOf,
} from "../mod.ts";

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
      let object: ReturnType<typeof _ObjectType>;

      object = { string: "", number: 0 };
      assertStrictEquals(_ObjectType(object), object);

      object = { string: "a", number: 1 };
      assertStrictEquals(_ObjectType(object), object);

      const unknownFieldObject: ReturnType<typeof _ObjectType> & {
        boolean: boolean;
      } = { string: "", number: 0, boolean: false };

      assertStrictEquals(_ObjectType(unknownFieldObject), unknownFieldObject);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` throw an error for the corresponding property of `value`", () => {
    let object: Record<string, unknown>;

    object = { string: 0, number: 0 };

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

    object = { s: "", number: 0 };

    assertThrows(
      () => _ObjectType(object),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, object).message,
    );

    assertThrows(
      () => _ObjectType(undefined),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, undefined).message,
    );
    assertThrows(
      () => _ObjectType(null),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, null).message,
    );
    assertThrows(
      () => _ObjectType(false),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, false).message,
    );
    assertThrows(
      () => _ObjectType(0),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, 0).message,
    );
    assertThrows(
      () => _ObjectType(""),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, "").message,
    );
    assertThrows(
      () => _ObjectType([]),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, []).message,
    );
    assertThrows(
      () => _ObjectType({}),
      TypeAssertionError,
      new TypeAssertionError(_ObjectType.typeName, {}).message,
    );
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
      let object: ReturnType<typeof _Intersection>;

      object = { a: "", b: "", c: "" };
      assertStrictEquals(_Intersection(object), object);

      object = { a: "a", b: "b", c: "c" };
      assertStrictEquals(_Intersection(object), object);

      const unknownFieldObject: ReturnType<typeof _Intersection> & {
        d: string;
      } = { a: "", b: "", c: "", d: "" };

      assertStrictEquals(_Intersection(unknownFieldObject), unknownFieldObject);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` of `asserterA` and `asserterB` throw an error for the corresponding property of `value`", () => {
    let object: Record<string, unknown>;

    object = { a: "", b: 0, c: "" };

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

    object = { b: "", c: "" };

    assertThrows(
      () => _Intersection(object),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object).message,
    );

    object = { a: 0, b: "", c: "" };

    assertThrows(
      () => _Intersection(object),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object).message,
    );

    object = { a: "", b: false, c: "" };

    assertThrows(
      () => _Intersection(object),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, object).message,
    );

    assertThrows(
      () => _Intersection(undefined),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, undefined).message,
    );
    assertThrows(
      () => _Intersection(null),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, null).message,
    );
    assertThrows(
      () => _Intersection(false),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, false).message,
    );
    assertThrows(
      () => _Intersection(0),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, 0).message,
    );
    assertThrows(
      () => _Intersection(""),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, "").message,
    );
    assertThrows(
      () => _Intersection([]),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, []).message,
    );
    assertThrows(
      () => _Intersection({}),
      TypeAssertionError,
      new TypeAssertionError(_Intersection.typeName, {}).message,
    );
  });
});
