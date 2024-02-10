import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { _number, _string, TypeAsserter, TypeAssertionError } from "../mod.ts";
import { UnionAsserter } from "./union_asserter.ts";

const _object = new TypeAsserter(
  "Record<string, unknown>",
  (value): value is Record<string, unknown> =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
);

const typeName = "stringOrNumberOrObject";
const memberAsserters = [_string, _number, _object];
const _stringOrNumberOrObject = new UnionAsserter(typeName, memberAsserters);

describe("UnionAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _stringOrNumberOrObject, typeName: typeName },

      {
        asserter: new UnionAsserter("", memberAsserters),
        typeName: "UnnamedUnion",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `memberAsserters` set to its `memberAsserters` property", () => {
    assertStrictEquals(
      _stringOrNumberOrObject.memberAsserters,
      memberAsserters,
    );
  });
});

describe("UnionAsserter.assert", () => {
  it("should return `value` when any of the `memberAsserters` do not throw an error for it", () => {
    const testCases = ["", "a", 0, 1, {}];

    for (const value of testCases) {
      assertStrictEquals(_stringOrNumberOrObject.assert(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when all of the `memberAsserters` throw an error for `value`", () => {
    assertThrows(
      () => _stringOrNumberOrObject.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = new UnionAsserter("", [_string, _number]);

    assertThrows(
      () => unnamedAsserter.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, []];

    for (const value of testCases) {
      assertThrows(
        () => _stringOrNumberOrObject.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_stringOrNumberOrObject.typeName, value).message,
      );
    }
  });
});
