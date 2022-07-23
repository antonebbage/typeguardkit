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

const _string = typeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);

const _object = typeAsserter(
  "Record<string, unknown>",
  (value): value is Record<string, unknown> =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
);

describe("typeAsserter", () => {
  it("should return a `Function` with `typeName` set to `name`", () => {
    const testCases = [
      { asserter: _string, typeName: "string" },
      { asserter: _object, typeName: "Record<string, unknown>" },
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it(
    "should return a `Function` that returns `value` when `typeGuard` returns `true` for `value`",
    () => {
      const testCases = [
        { asserter: _string, values: ["", "a"] },
        { asserter: _object, values: [{}] },
      ];

      for (const { asserter, values } of testCases) {
        for (const value of values) {
          assertStrictEquals(asserter(value), value);
        }
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `typeGuard` returns `false` for `value`", () => {
    assertThrows(
      () => _string(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
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

  it("should return a `Function` with `typeName` set to `name`", () => {
    assertInstanceOf(_NumericEnum, Function);
    assertStrictEquals(_NumericEnum.typeName, numericEnumName);
  });

  it(
    "should return a `Function` that returns `value` when it is equal to one of `enumObject`'s members",
    () => {
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

          values: [
            HeterogeneousEnum.A,
            HeterogeneousEnum.B,
            HeterogeneousEnum.C,
          ],
        },
      ];

      for (const { asserter, values } of testCases) {
        for (const value of values) {
          assertStrictEquals(asserter(value), value);
        }
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not equal to any of `enumObject`'s members", () => {
    assertThrows(
      () => _NumericEnum(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_NumericEnum.typeName, undefined, {
        valueName: "name",
      })
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
          new TypeAssertionError(asserter.typeName, value).message,
        );
      }
    }
  });
});

describe("literalUnionAsserter", () => {
  const typeName = "LiteralUnion";

  const _LiteralUnion = literalUnionAsserter(
    typeName,
    [0, 1, "", "a"] as const,
  );

  it("should return a `Function` with `typeName` set to `name`", () => {
    assertInstanceOf(_LiteralUnion, Function);
    assertStrictEquals(_LiteralUnion.typeName, typeName);
  });

  it(
    "should return a `Function` that returns `value` when it is equal to one of the `literals`",
    () => {
      const testCases = [0, 1, "", "a"];

      for (const value of testCases) {
        assertStrictEquals(_LiteralUnion(value), value);
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not equal to any of the `literals`", () => {
    assertThrows(
      () => _LiteralUnion(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, undefined, {
        valueName: "name",
      })
        .message,
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
  const _stringOrNumberOrObject = unionOf(_string, _number, _object);

  it("should return a `Function` with correct `typeName`", () => {
    assertInstanceOf(_stringOrNumberOrObject, Function);

    assertStrictEquals(
      _stringOrNumberOrObject.typeName,
      `${_string.typeName} | ${_number.typeName} | ${_object.typeName}`,
    );
  });

  it(
    "should return a `Function` that returns `value` when any of the `asserters` do not throw an error for it",
    () => {
      const testCases = ["", "a", 0, 1, {}];

      for (const value of testCases) {
        assertStrictEquals(_stringOrNumberOrObject(value), value);
      }
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when all of the `asserters` throw an error for `value`", () => {
    assertThrows(
      () => _stringOrNumberOrObject(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined, {
        valueName: "name",
      })
        .message,
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

  it("should return a `Function` with the provided `typeName` or the correct default if `undefined`", () => {
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
    ];

    for (const { asserter, typeName } of testCases) {
      assertInstanceOf(asserter, Function);
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it(
    "should return a `Function` that returns `value` when it is an `Array` where `asserter` does not throw an error for any element",
    () => {
      const testCases = [
        { asserter: _arrayOfString, values: [[], [""], ["a", "b", "c"]] },
        { asserter: _arrayOfNumber, values: [[], [0], [0, 1, 2]] },
      ];

      for (const { asserter, values } of testCases) {
        for (const value of values) {
          assertStrictEquals(asserter(value), value);
        }
      }
    },
  );

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
