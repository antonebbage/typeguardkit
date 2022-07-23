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
import {
  objectAsserter,
  objectIntersectionOf,
  partialFrom,
  pickFrom,
} from "./object_asserter.ts";

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

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined`", () => {
    const testCases = [
      { asserter: _Intersection, typeName: intersectionName },
      {
        asserter: objectIntersectionOf(_ObjectType1, _ObjectType2),
        typeName: `${_ObjectType1.typeName} & ${_ObjectType2.typeName}`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
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

describe("partialFrom", () => {
  const _ObjectType = objectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const _PartialObjectType = partialFrom(_ObjectType);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined`", () => {
    const testCases = [
      {
        asserter: partialFrom(_ObjectType, "PartialObjectType"),
        typeName: "PartialObjectType",
      },
      {
        asserter: _PartialObjectType,
        typeName: `Partial<${_ObjectType.typeName}>`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it(
    "should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value` when not `undefined`",
    () => {
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
        assertStrictEquals(_PartialObjectType(value), value);
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` throw an error for the corresponding property of `value` when not `undefined`", () => {
    const object = { a: 0, b: 0, c: false };

    assertThrows(
      () => _PartialObjectType(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PartialObjectType.typeName, object, {
        valueName: "name",
        innerError: new TypeAssertionError(
          _PartialObjectType.propertyAsserters.a.typeName,
          object.a,
          { valueName: '["a"]' },
        ),
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
        () => _PartialObjectType(value),
        TypeAssertionError,
        new TypeAssertionError(_PartialObjectType.typeName, value).message,
      );
    }
  });
});

describe("pickFrom", () => {
  const _ObjectType = objectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const _PickedObjectType = pickFrom(_ObjectType, ["b", "c"]);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined`", () => {
    const testCases = [
      {
        asserter: pickFrom(_ObjectType, ["a"], "PickedObjectType"),
        typeName: "PickedObjectType",
      },
      {
        asserter: _PickedObjectType,
        typeName: `Pick<${_ObjectType.typeName}, "b" | "c">`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it(
    "should return a `Function` that returns `value` when it is an object and none of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding properties of `value`",
    () => {
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
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding property of `value`", () => {
    const object = { b: "", c: false };

    assertThrows(
      () => _PickedObjectType(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PickedObjectType.typeName, object, {
        valueName: "name",
        innerError: new TypeAssertionError(
          _PickedObjectType.propertyAsserters.b.typeName,
          object.b,
          { valueName: '["b"]' },
        ),
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
        new TypeAssertionError(_PickedObjectType.typeName, value).message,
      );
    }
  });
});
