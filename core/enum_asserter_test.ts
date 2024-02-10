import { assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "../mod.ts";
import { EnumAsserter } from "./enum_asserter.ts";

const numericEnumName = "NumericEnum";

enum NumericEnum {
  A,
  B,
  C,
}

const _NumericEnum = new EnumAsserter(numericEnumName, NumericEnum);

const stringEnumName = "StringEnum";

enum StringEnum {
  A = "A",
  B = "B",
  C = "C",
}

const _StringEnum = new EnumAsserter(stringEnumName, StringEnum);

const heterogeneousEnumName = "HeterogeneousEnum";

enum HeterogeneousEnum {
  A,
  B,
  C = "C",
}

const _HeterogeneousEnum = new EnumAsserter(
  heterogeneousEnumName,
  HeterogeneousEnum,
);

describe("EnumAsserter", () => {
  it("should have the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _NumericEnum, typeName: numericEnumName },
      { asserter: _StringEnum, typeName: stringEnumName },
      { asserter: _HeterogeneousEnum, typeName: heterogeneousEnumName },

      {
        asserter: new EnumAsserter("", NumericEnum),
        typeName: "UnnamedEnum",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should have the provided `enumObject` set to its `enumObject` property", () => {
    const testCases = [
      { asserter: _NumericEnum, enumObject: NumericEnum },
      { asserter: _StringEnum, enumObject: StringEnum },
      { asserter: _HeterogeneousEnum, enumObject: HeterogeneousEnum },
    ];

    for (const { asserter, enumObject } of testCases) {
      assertStrictEquals(asserter.enumObject, enumObject);
    }
  });
});

describe("EnumAsserter.assert", () => {
  it("should return `value` when it is equal to one of `enumObject`'s members", () => {
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
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` when `value` is not equal to any of `enumObject`'s members", () => {
    assertThrows(
      () => _NumericEnum.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_NumericEnum.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = new EnumAsserter("", NumericEnum);

    assertThrows(
      () => unnamedAsserter.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
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
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});
