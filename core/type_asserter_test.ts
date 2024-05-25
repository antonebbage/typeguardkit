import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError } from "../mod.ts";
import { TypeAsserter } from "./type_asserter.ts";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

const _string = new TypeAsserter("string", isString);

const _object = new TypeAsserter(
  "Record<string, unknown>",
  (value): value is Record<string, unknown> =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
);

describe("TypeAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _string, typeName: "string" },
      { asserter: _object, typeName: "Record<string, unknown>" },
      { asserter: new TypeAsserter("", isString), typeName: "UnnamedType" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });
});

describe("TypeAsserter.assert", () => {
  it("should return `value` when `typeGuard` returns `true` for `value`", () => {
    const testCases = [
      { asserter: _string, values: ["", "a"] },
      { asserter: _object, values: [{}] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `typeGuard` returns `false` for `value`", () => {
    assertThrows(
      () => _string.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    const unnamedAsserter = new TypeAsserter("", isString);

    assertThrows(
      () => unnamedAsserter.assert(undefined),
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
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
