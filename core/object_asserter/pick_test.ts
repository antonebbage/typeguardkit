import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _boolean,
  _number,
  _string,
  ObjectAsserter,
  PickAsserter,
  TypeAssertionError,
} from "../../mod.ts";
import { pick } from "./pick.ts";

describe("pick", () => {
  const _ObjectType = new ObjectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const keys: Array<keyof ReturnType<typeof _ObjectType.assert>> = ["b", "c"];

  const _PickedObjectType = pick(_ObjectType, keys);

  it("should return a `PickAsserter`", () => {
    assertInstanceOf(_PickedObjectType, PickAsserter);
  });

  it("should return a `PickAsserter` with the correct `typeName`", () => {
    assertStrictEquals(
      _PickedObjectType.typeName,
      `Pick<${_ObjectType.typeName}, "b" | "c">`,
    );
  });

  it("should return a `PickAsserter` whose `assert` method returns `value` when it is an object and none of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding properties of `value`", () => {
    const testCases = [
      { b: 0, c: false },
      { b: 1, c: true },
      { a: "", b: 0, c: false },
      { a: 0, b: 0, c: false },
      { b: 0, c: false, d: "" },
    ];

    for (const value of testCases) {
      assertStrictEquals(_PickedObjectType.assert(value), value);
    }
  });

  it("should return a `PickAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` with `keys` throw an error for the corresponding property of `value`", () => {
    const object = { b: "", c: "" };

    assertThrows(
      () => _PickedObjectType.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PickedObjectType.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.b.typeName,
            object.b,
            { valueName: "b" },
          ),

          new TypeAssertionError(
            _PickedObjectType.propertyAsserters.c.typeName,
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
        () => _PickedObjectType.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_PickedObjectType.typeName, value).message,
      );
    }
  });
});
