import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { typeAsserter } from "./asserter.ts";

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

  it("should return a `Function` with the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _string, typeName: "string" },
      { asserter: _object, typeName: "Record<string, unknown>" },
      { asserter: typeAsserter("", isString), typeName: "UnnamedType" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
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
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    const unnamedAsserter = typeAsserter("", isString);

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
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
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
