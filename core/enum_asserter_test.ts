import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { typeAsserterTypeName, TypeAssertionError } from "../mod.ts";
import { enumAsserter } from "./enum_asserter.ts";

describe("enumAsserter", () => {
  const numericEnumName = "NumericEnum";

  enum NumericEnum {
    A,
    B,
    C,
  }

  const _NumericEnum = enumAsserter(numericEnumName, NumericEnum);

  const stringEnumName = "StringEnum";

  enum StringEnum {
    A = "A",
    B = "B",
    C = "C",
  }

  const _StringEnum = enumAsserter(stringEnumName, StringEnum);

  const heterogeneousEnumName = "HeterogeneousEnum";

  enum HeterogeneousEnum {
    A,
    B,
    C = "C",
  }

  const _HeterogeneousEnum = enumAsserter(
    heterogeneousEnumName,
    HeterogeneousEnum,
  );

  it("should return a `Function`", () => {
    assertInstanceOf(_NumericEnum, Function);
  });

  it("should return a `Function` with the correct `asserterTypeName`", () => {
    assertStrictEquals(_NumericEnum.asserterTypeName, typeAsserterTypeName);
  });

  it("should return a `Function` with the provided `assertedTypeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _NumericEnum, assertedTypeName: numericEnumName },
      { asserter: _StringEnum, assertedTypeName: stringEnumName },
      { asserter: _HeterogeneousEnum, assertedTypeName: heterogeneousEnumName },

      {
        asserter: enumAsserter("", NumericEnum),
        assertedTypeName: "UnnamedEnum",
      },
    ];

    for (const { asserter, assertedTypeName } of testCases) {
      assertStrictEquals(asserter.assertedTypeName, assertedTypeName);
    }
  });

  it("should return a `Function` that returns `value` when it is equal to one of `enumObject`'s members", () => {
    const testCases = [
      {
        asserter: _NumericEnum,
        values: [NumericEnum.A, NumericEnum.B, NumericEnum.C],
      },

      {
        asserter: _StringEnum,
        values: [StringEnum.A, StringEnum.B, StringEnum.C],
      },

      {
        asserter: _HeterogeneousEnum,
        values: [HeterogeneousEnum.A, HeterogeneousEnum.B, HeterogeneousEnum.C],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not equal to any of `enumObject`'s members", () => {
    assertThrows(
      () => _NumericEnum(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_NumericEnum.assertedTypeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = enumAsserter("", NumericEnum);

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.assertedTypeName, undefined)
        .message,
    );

    const testCases = [
      {
        asserter: _NumericEnum,
        values: [undefined, null, false, "", [], {}, "A", 3],
      },

      { asserter: _StringEnum, values: [0] },
      { asserter: _HeterogeneousEnum, values: ["A", 2] },
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
