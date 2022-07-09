import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
  describe,
  it,
} from "/dev_deps.ts";
import { _number, TypeAssertionError } from "../mod.ts";
import {
  arrayOf,
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
    assertInstanceOf(_string, Function);
    assertInstanceOf(_object, Function);

    assertStrictEquals(_string.typeName, "string");
    assertStrictEquals(_object.typeName, "Record<string, unknown>");
  });

  it(
    "should return a `Function` that returns `value` when `typeGuard` returns `true` for `value`",
    () => {
      assertStrictEquals(_string(""), "");
      assertStrictEquals(_string("a"), "a");

      const object = {};
      assertStrictEquals(_object(object), object);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `typeGuard` returns `false` for `value`", () => {
    assertThrows(
      () => _string(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => _string(undefined),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined).message,
    );
    assertThrows(
      () => _string(null),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, null).message,
    );
    assertThrows(
      () => _string(false),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, false).message,
    );
    assertThrows(
      () => _string(0),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, 0).message,
    );
    assertThrows(
      () => _string([]),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, []).message,
    );
    assertThrows(
      () => _string({}),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, {}).message,
    );

    assertThrows(
      () => _object(undefined),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, undefined).message,
    );
    assertThrows(
      () => _object(null),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, null).message,
    );
    assertThrows(
      () => _object(false),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, false).message,
    );
    assertThrows(
      () => _object(0),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, 0).message,
    );
    assertThrows(
      () => _object(""),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, "").message,
    );
    assertThrows(
      () => _object([]),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, []).message,
    );
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
      assertStrictEquals(_LiteralUnion(0), 0);
      assertStrictEquals(_LiteralUnion(1), 1);
      assertStrictEquals(_LiteralUnion(""), "");
      assertStrictEquals(_LiteralUnion("a"), "a");
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

    assertThrows(
      () => _LiteralUnion(undefined),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, undefined).message,
    );
    assertThrows(
      () => _LiteralUnion(null),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, null).message,
    );
    assertThrows(
      () => _LiteralUnion(false),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, false).message,
    );
    assertThrows(
      () => _LiteralUnion([]),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, []).message,
    );
    assertThrows(
      () => _LiteralUnion({}),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, {}).message,
    );

    assertThrows(
      () => _LiteralUnion(2),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, 2).message,
    );
    assertThrows(
      () => _LiteralUnion("b"),
      TypeAssertionError,
      new TypeAssertionError(_LiteralUnion.typeName, "b").message,
    );
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
      assertStrictEquals(_stringOrNumberOrObject(""), "");
      assertStrictEquals(_stringOrNumberOrObject("a"), "a");

      assertStrictEquals(_stringOrNumberOrObject(0), 0);
      assertStrictEquals(_stringOrNumberOrObject(1), 1);

      const object = {};
      assertStrictEquals(_stringOrNumberOrObject(object), object);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when all of the `asserters` throw an error for `value`", () => {
    assertThrows(
      () => _stringOrNumberOrObject(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined, {
        valueName: "name",
      }).message,
    );

    assertThrows(
      () => _stringOrNumberOrObject(undefined),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, undefined)
        .message,
    );
    assertThrows(
      () => _stringOrNumberOrObject(null),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, null).message,
    );
    assertThrows(
      () => _stringOrNumberOrObject(false),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, false).message,
    );
    assertThrows(
      () => _stringOrNumberOrObject([]),
      TypeAssertionError,
      new TypeAssertionError(_stringOrNumberOrObject.typeName, []).message,
    );
  });
});

describe("arrayOf", () => {
  const _arrayOfString = arrayOf(_string);
  const _arrayOfNumber = arrayOf(_number);

  it("should return a `Function` with correct `typeName`", () => {
    assertInstanceOf(_arrayOfString, Function);
    assertInstanceOf(_arrayOfNumber, Function);

    assertStrictEquals(_arrayOfString.typeName, `Array<${_string.typeName}>`);
    assertStrictEquals(_arrayOfNumber.typeName, `Array<${_number.typeName}>`);
  });

  it(
    "should return a `Function` that returns `value` when it is an array where `asserter` does not throw an error for any element",
    () => {
      let arrayOfString: string[];

      arrayOfString = [];
      assertStrictEquals(_arrayOfString(arrayOfString), arrayOfString);

      arrayOfString = [""];
      assertStrictEquals(_arrayOfString(arrayOfString), arrayOfString);

      arrayOfString = ["a", "b", "c"];
      assertStrictEquals(_arrayOfString(arrayOfString), arrayOfString);

      let arrayOfNumber: number[];

      arrayOfNumber = [];
      assertStrictEquals(_arrayOfNumber(arrayOfNumber), arrayOfNumber);

      arrayOfNumber = [0];
      assertStrictEquals(_arrayOfNumber(arrayOfNumber), arrayOfNumber);

      arrayOfNumber = [1, 2, 3];
      assertStrictEquals(_arrayOfNumber(arrayOfNumber), arrayOfNumber);
    },
  );

  it("should return a `Function` that throws a `TypeAssertionError` with correct `message` when `value` is not an array where `asserter` does not throw an error for any element", () => {
    assertThrows(
      () => _arrayOfString(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, undefined, {
        valueName: "name",
      }).message,
    );

    assertThrows(
      () => _arrayOfString(undefined),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, undefined).message,
    );
    assertThrows(
      () => _arrayOfString(null),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, null).message,
    );
    assertThrows(
      () => _arrayOfString(false),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, false).message,
    );
    assertThrows(
      () => _arrayOfString(0),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, 0).message,
    );
    assertThrows(
      () => _arrayOfString(""),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, "").message,
    );
    assertThrows(
      () => _arrayOfString({}),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, {}).message,
    );

    assertThrows(
      () => _arrayOfString([undefined]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [undefined]).message,
    );
    assertThrows(
      () => _arrayOfString([null]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [null]).message,
    );
    assertThrows(
      () => _arrayOfString([false]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [false]).message,
    );
    assertThrows(
      () => _arrayOfString([0]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [0]).message,
    );
    assertThrows(
      () => _arrayOfString([[]]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [[]]).message,
    );
    assertThrows(
      () => _arrayOfString([{}]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, [{}]).message,
    );

    assertThrows(
      () => _arrayOfString(["", undefined]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfString.typeName, ["", undefined]).message,
    );

    assertThrows(
      () => _arrayOfNumber([undefined]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [undefined]).message,
    );
    assertThrows(
      () => _arrayOfNumber([null]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [null]).message,
    );
    assertThrows(
      () => _arrayOfNumber([false]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [false]).message,
    );
    assertThrows(
      () => _arrayOfNumber([""]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [""]).message,
    );
    assertThrows(
      () => _arrayOfNumber([[]]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [[]]).message,
    );
    assertThrows(
      () => _arrayOfNumber([{}]),
      TypeAssertionError,
      new TypeAssertionError(_arrayOfNumber.typeName, [{}]).message,
    );
  });
});
