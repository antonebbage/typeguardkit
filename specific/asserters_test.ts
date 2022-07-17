import { assertStrictEquals, assertThrows, describe, it } from "/dev_deps.ts";
import { TypeAssertionError } from "/mod.ts";
import { _boolean, _null, _number, _string, _undefined } from "./asserters.ts";

describe("_boolean", () => {
  it("should return `value` if of type `boolean`", () => {
    const testCases = [false, true];

    for (const value of testCases) {
      assertStrictEquals(_boolean(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `boolean`", () => {
    assertThrows(
      () => _boolean(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    const testCases = [undefined, null, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _boolean(value),
        TypeAssertionError,
        new TypeAssertionError(_boolean.typeName, value).message,
      );
    }
  });
});

describe("_number", () => {
  it("should return `value` if of type `number`", () => {
    const testCases = [0, 1];

    for (const value of testCases) {
      assertStrictEquals(_number(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `number`", () => {
    assertThrows(
      () => _number(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined, { valueName: "name" })
        .message,
    );

    const testCases = [undefined, null, false, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _number(value),
        TypeAssertionError,
        new TypeAssertionError(_number.typeName, value).message,
      );
    }
  });
});

describe("_string", () => {
  it("should return `value` if of type `string`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(_string(value), value);
    }
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not of type `string`", () => {
    assertThrows(
      () => _string(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _string(value),
        TypeAssertionError,
        new TypeAssertionError(_string.typeName, value).message,
      );
    }
  });
});

describe("_null", () => {
  it("should return `value` if `null`", () => {
    assertStrictEquals(_null(null), null);
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not `null`", () => {
    assertThrows(
      () => _null(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_null.typeName, undefined, { valueName: "name" })
        .message,
    );

    const testCases = [undefined, false, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _null(value),
        TypeAssertionError,
        new TypeAssertionError(_null.typeName, value).message,
      );
    }
  });
});

describe("_undefined", () => {
  it("should return `value` if `undefined`", () => {
    assertStrictEquals(_undefined(undefined), undefined);
  });

  it("should throw a `TypeAssertionError` with correct `message` if `value` not `undefined`", () => {
    assertThrows(
      () => _undefined(null, "name"),
      TypeAssertionError,
      new TypeAssertionError(_undefined.typeName, null, { valueName: "name" })
        .message,
    );

    const testCases = [null, false, 0, "", [], {}];

    for (const value of testCases) {
      assertThrows(
        () => _undefined(value),
        TypeAssertionError,
        new TypeAssertionError(_undefined.typeName, value).message,
      );
    }
  });
});
