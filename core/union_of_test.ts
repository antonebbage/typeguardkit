import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _number, _string, typeAsserter, TypeAssertionError } from "../mod.ts";
import { unionOf } from "./union_of.ts";

const _object = typeAsserter(
  "Record<string, unknown>",
  (value): value is Record<string, unknown> =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
);

describe("unionOf", () => {
  const memberAsserters = [_string, _number, _object];

  const _stringOrNumberOrObject = unionOf(memberAsserters);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const defaultTypeName =
      `${_string.typeName} | ${_number.typeName} | ${_object.typeName}`;

    const testCases = [
      {
        asserter: unionOf([_string, _number], "StringOrNumber"),
        typeName: "StringOrNumber",
      },
      {
        asserter: _stringOrNumberOrObject,
        typeName: defaultTypeName,
      },
      {
        asserter: unionOf(memberAsserters, ""),
        typeName: defaultTypeName,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when any of the `asserters` do not throw an error for it", () => {
    const testCases = ["", "a", 0, 1, {}];

    for (const value of testCases) {
      assertStrictEquals(_stringOrNumberOrObject(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when all of the `asserters` throw an error for `value`", () => {
    assertThrows(
      () => _stringOrNumberOrObject(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const namedAsserter = unionOf(memberAsserters, "StringOrNumberOrObject");

    assertThrows(
      () => namedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, []];

    for (const value of testCases) {
      assertThrows(
        () => _stringOrNumberOrObject(value),
        TypeAssertionError,
        new TypeAssertionError(_stringOrNumberOrObject.typeName, value).message,
      );
    }
  });
});
