import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { typeAsserter } from "./type_asserter.ts";

describe("typeAsserter", () => {
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  const _string = typeAsserter("string", isString);

  const _object = typeAsserter(
    "Record<string, unknown>",
    (value): value is Record<string, unknown> =>
      typeof value === "object" && !Array.isArray(value) && value !== null,
  );

  it("should return a `Function`", () => {
    assertInstanceOf(_string, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(_string.asserterTypeName, "TypeAsserter");
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _string, assertedTypeName: "string" },
      { asserter: _object, assertedTypeName: "Record<string, unknown>" },
      { asserter: typeAsserter("", isString), assertedTypeName: "UnnamedType" },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` that returns `value` when `typeGuard` returns `true` for `value`", () => {
    const testCases = [
      { asserter: _string, values: ["", "a"] },
      { asserter: _object, values: [{}] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `typeGuard` returns `false` for `value`", () => {
    assertThrows(
      () => _string(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = typeAsserter("", isString);

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.assertedTypeName, undefined)
        .message,
    );

    const testCases = [
      { asserter: _string, values: [undefined, null, false, 0, [], {}] },
      { asserter: _object, values: [undefined, null, false, 0, "", []] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertThrows(
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.assertedTypeName, value).message,
        );
      }
    }
  });
});
