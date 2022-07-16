import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
  describe,
  it,
} from "/dev_deps.ts";
import { _number, _string, TypeAssertionError } from "../mod.ts";
import { objectAsserter } from "./object_asserter.ts";

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
