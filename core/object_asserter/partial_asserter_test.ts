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
  TypeAssertionError,
} from "../../mod.ts";
import { PartialAsserter } from "./partial_asserter.ts";

const _ObjectType = new ObjectAsserter("ObjectType", {
  a: _string,
  b: _number,
  c: _boolean,
});

const partialObjectType1Name = "PartialObjectType1";

const _PartialObjectType1 = new PartialAsserter(
  partialObjectType1Name,
  _ObjectType,
);

const _PartialObjectType2 = new PartialAsserter(
  "PartialObjectType2",
  _ObjectType.propertyAsserters,
);

describe("PartialAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _PartialObjectType1, typeName: partialObjectType1Name },

      {
        asserter: new PartialAsserter("", _ObjectType),
        typeName: "UnnamedPartial",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have `propertyAsserters` that are all the correct type", () => {
    for (
      const asserter of Object.values(_PartialObjectType1.propertyAsserters)
    ) {
      assertInstanceOf(asserter, OptionAsserter);
    }

    for (
      const asserter of Object.values(_PartialObjectType2.propertyAsserters)
    ) {
      assertInstanceOf(asserter, OptionAsserter);
    }
  });
});

describe("PartialAsserter.assert", () => {
  it("should return `value` when it is an object and none of the `asserter.propertyAsserters` throw an error for the corresponding properties of `value` when not `undefined`", () => {
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
      assertStrictEquals(_PartialObjectType1.assert(value), value);
      assertStrictEquals(_PartialObjectType2.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not an object, or any of the `asserter.propertyAsserters` throw an error for the corresponding property of `value` when not `undefined`", () => {
    const object = { a: 0, b: "", c: false };

    assertThrows(
      () => _PartialObjectType1.assert(object, "name"),
      TypeAssertionError,
      new TypeAssertionError(_PartialObjectType1.typeName, object, {
        valueName: "name",

        issues: [
          new TypeAssertionError(
            _PartialObjectType1.propertyAsserters.a.typeName,
            object.a,
            { valueName: ".a" },
          ),

          new TypeAssertionError(
            _PartialObjectType1.propertyAsserters.b.typeName,
            object.b,
            { valueName: ".b" },
          ),
        ],
      })
        .message,
    );

    const unnamedAsserter = new PartialAsserter("", _ObjectType);

    assertThrows(
      () => unnamedAsserter.assert(object),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, object, {
        issues: [
          new TypeAssertionError(
            _PartialObjectType1.propertyAsserters.a.typeName,
            object.a,
            { valueName: ".a" },
          ),

          new TypeAssertionError(
            _PartialObjectType1.propertyAsserters.b.typeName,
            object.b,
            { valueName: ".b" },
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
        () => _PartialObjectType1.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_PartialObjectType1.typeName, value).message,
      );
    }
  });
});
