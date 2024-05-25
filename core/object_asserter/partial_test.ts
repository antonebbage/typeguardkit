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
  OptionAsserter,
  PartialAsserter,
  TypeAssertionError,
} from "../../mod.ts";
import { partial } from "./partial.ts";

describe("partial", () => {
  const _ObjectType = new ObjectAsserter("ObjectType", {
    a: _string,
    b: _number,
    c: _boolean,
  });

  const _PartialObjectType = partial(_ObjectType);

  it("should return a `PartialAsserter`", () => {
    assertInstanceOf(_PartialObjectType, PartialAsserter);
  });

  it("should return a `PartialAsserter` with the correct `typeName`", () => {
    assertStrictEquals(
      _PartialObjectType.typeName,
      `Partial<${_ObjectType.typeName}>`,
    );
  });

  it("should return a `PartialAsserter` whose `propertyAsserters` are all the correct type", () => {
    for (
      const asserter of Object.values(_PartialObjectType.propertyAsserters)
    ) {
      assertInstanceOf(asserter, OptionAsserter);
    }
  });

  it("should return a `PartialAsserter` whose `assert` method returns `value` when it is an object and none of the `propertyAsserters` throw an error for the corresponding properties of `value` when not `undefined`", () => {
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

  it("should return a `PartialAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` throw an error for the corresponding property of `value` when not `undefined`", () => {
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
