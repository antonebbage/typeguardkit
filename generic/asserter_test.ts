import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _number, TypeAssertionError } from "../mod.ts";
import {
  arrayOf,
  enumAsserter,
  literalUnionAsserter,
  typeAsserter,
  unionOf,
} from "./asserter.ts";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

const _string = typeAsserter("string", isString);

const _object = typeAsserter(
  "Record<string, unknown>",
  (value): value is Record<string, unknown> =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
);

describe("typeAsserter", () => {
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

  it("should return a `Function` with the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _NumericEnum, typeName: numericEnumName },
      { asserter: _StringEnum, typeName: stringEnumName },
      { asserter: _HeterogeneousEnum, typeName: heterogeneousEnumName },
      { asserter: enumAsserter("", NumericEnum), typeName: "UnnamedEnum" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
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
      new TypeAssertionError(_NumericEnum.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = enumAsserter("", NumericEnum);

    assertThrows(
      () => unnamedAsserter(undefined),
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
          () => asserter(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});

describe("literalUnionAsserter", () => {
  const literalUnionName = "LiteralUnion";

  const _LiteralUnion = literalUnionAsserter(
    literalUnionName,
    [0, 1, "", "a"] as const,
  );

  it("should return a `Function` with the provided `typeName` or the correct default if empty", () => {
    const testCases = [
      { asserter: _LiteralUnion, typeName: literalUnionName },
      {
        asserter: literalUnionAsserter("", [0, 1] as const),
        typeName: "UnnamedLiteralUnion",
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is equal to one of the `literals`", () => {
    const testCases = [0, 1, "", "a"];

    for (const value of testCases) {
      assertStrictEquals(_LiteralUnion(value), value);
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not equal to any of the `literals`", () => {
    assertThrows(
      () => _LiteralUnion(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const unnamedAsserter = literalUnionAsserter("", [0, 1, "", "a"] as const);

    assertThrows(
      () => unnamedAsserter(undefined),
      TypeAssertionError,
      new TypeAssertionError(unnamedAsserter.typeName, undefined).message,
    );

    const testCases = [undefined, null, false, [], {}, 2, "b"];

    for (const value of testCases) {
      assertThrows(
        () => _LiteralUnion(value),
        TypeAssertionError,
        new TypeAssertionError(_LiteralUnion.typeName, value).message,
      );
    }
  });
});

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

describe("arrayOf", () => {
  const _arrayOfString = arrayOf(_string);
  const _arrayOfNumber = arrayOf(_number);

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined` or empty", () => {
    const testCases = [
      {
        asserter: arrayOf(_string, "ArrayOfString"),
        typeName: "ArrayOfString",
      },
      {
        asserter: _arrayOfString,
        typeName: `Array<${_string.typeName}>`,
      },
      {
        asserter: _arrayOfNumber,
        typeName: `Array<${_number.typeName}>`,
      },
      {
        asserter: arrayOf(_string, ""),
        typeName: `Array<${_string.typeName}>`,
      },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return a `Function` that returns `value` when it is an `Array` where `asserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _arrayOfString, values: [[], [""], ["a", "b", "c"]] },
      { asserter: _arrayOfNumber, values: [[], [0], [0, 1, 2]] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter(value), value);
      }
    }
  });

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an `Array` where `asserter` does not throw an error for any element", () => {
    assertThrows(
      () => _arrayOfString([undefined], "name"),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [undefined], {
        valueName: "name",
        innerError: new TypeAssertionError(_string.typeName, undefined, {
          valueName: "[0]",
        }),
      })
        .message,
    );

    const namedAsserter = arrayOf(_string, "ArrayOfString");

    assertThrows(
      () => namedAsserter([undefined]),
      TypeAssertionError,
      new TypeAssertionError(namedAsserter.typeName, [undefined], {
        innerError: new TypeAssertionError(_string.typeName, undefined, {
          valueName: "[0]",
        }),
      })
        .message,
    );

    const testCases = [
      {
        asserter: _arrayOfString,

        values: [
          undefined,
          null,
          false,
          0,
          "",
          {},

          [undefined],
          [null],
          [false],
          [0],
          [[]],
          [{}],

          ["", undefined],
        ],
      },
      {
        asserter: _arrayOfNumber,
        values: [[undefined], [null], [false], [""], [[]], [{}]],
      },
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
