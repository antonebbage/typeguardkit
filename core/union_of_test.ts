import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  TypeAsserter,
  TypeAssertionError,
  UnionAsserter,
} from "../mod.ts";
import { unionOf } from "./union_of.ts";

describe("unionOf", () => {
  const _object = new TypeAsserter(
    "Record<string, unknown>",
    (value): value is Record<string, unknown> =>
      typeof value === "object" && !Array.isArray(value) && value !== null,
  );

  const memberAsserters = [_string, _number, _object];
  const _stringOrNumberOrObject = unionOf(...memberAsserters);

  it("should return a `UnionAsserter`", () => {
    assertInstanceOf(_stringOrNumberOrObject, UnionAsserter);
  });

  it("should return a `UnionAsserter` with the correct `typeName`", () => {
    assertStrictEquals(
      _stringOrNumberOrObject.typeName,
      memberAsserters.map(({ typeName }) => typeName).join(" | "),
    );
  });

  it("should return a `UnionAsserter` with the provided `memberAsserters` set to its `memberAsserters` property", () => {
    for (let i = 0; i < memberAsserters.length; i++) {
      assertStrictEquals(
        _stringOrNumberOrObject.memberAsserters[i],
        memberAsserters[i],
      );
    }
  });

  it("should return a `UnionAsserter` whose `assert` method returns `value` when any of the `memberAsserters` do not throw an error for it", () => {
    const testCases = ["", "a", 0, 1, {}];

    for (const value of testCases) {
      assertStrictEquals(_stringOrNumberOrObject.assert(value), value);
    }
  });

  it("should return a `UnionAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when all of the `memberAsserters` throw an error for `value`", () => {
    assertThrows(
      () => _stringOrNumberOrObject.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined, {
        valueName: "name",
      })
        .message,
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
