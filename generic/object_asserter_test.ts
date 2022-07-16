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
  const objectTypeName = "object";

  const _object = objectAsserter(objectTypeName, {
    string: _string,
    number: _number,
  });

  it("should return a `Function` with the provided `typeName`", () => {
    assertInstanceOf(_object, Function);
    assertStrictEquals(_object.typeName, objectTypeName);
  });

  it(
    "should return a `Function` that returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value`",
    () => {
      let object: ReturnType<typeof _object>;

      object = { string: "", number: 0 };
      assertStrictEquals(_object(object), object);

      object = { string: "a", number: 1 };
      assertStrictEquals(_object(object), object);

      const unknownFieldObject: ReturnType<typeof _object> & {
        boolean: boolean;
      } = { string: "", number: 0, boolean: false };

      assertStrictEquals(_object(unknownFieldObject), unknownFieldObject);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `propertyAsserters` throw an error for the corresponding property of `value`", () => {
    let object: Record<string, unknown>;

    object = { string: 0, number: 0 };

    assertThrows(
      () => _object(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, object, {
        valueName: "name",
        innerError: new TypeAssertionError(
          _object.propertyAsserters.string.typeName,
          object.number,
          { valueName: '["string"]' },
        ),
      })
        .message,
    );

    object = { s: "", number: 0 };

    assertThrows(
      () => _object(object),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, object).message,
    );

    assertThrows(
      () => _object(undefined),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, undefined).message,
    );
    assertThrows(
      () => _object(null),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, null).message,
    );
    assertThrows(
      () => _object(false),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, false).message,
    );
    assertThrows(
      () => _object(0),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, 0).message,
    );
    assertThrows(
      () => _object(""),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, "").message,
    );
    assertThrows(
      () => _object([]),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, []).message,
    );
    assertThrows(
      () => _object({}),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, {}).message,
    );
  });
});
