import { assertStrictEquals, assertThrows, describe, it } from "/dev_deps.ts";
import { _string, TypeAssertionError } from "../mod.ts";
import { assertIs } from "./assert_is.ts";

describe("assertIs", () => {
  it("should return `undefined` if `asserter` does not throw an error for `value`", () => {
    assertStrictEquals(assertIs(_string, ""), undefined);
    assertStrictEquals(assertIs(_string, "a"), undefined);
  });

  it("should allow an error thrown by `asserter` for `value` to bubble up", () => {
    assertThrows(
      () => assertIs(_string, undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: "name" })
        .message,
    );

    assertThrows(
      () => assertIs(_string, undefined),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined).message,
    );
    assertThrows(
      () => assertIs(_string, null),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, null).message,
    );
    assertThrows(
      () => assertIs(_string, false),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, false).message,
    );
    assertThrows(
      () => assertIs(_string, 0),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, 0).message,
    );
    assertThrows(
      () => assertIs(_string, []),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, []).message,
    );
    assertThrows(
      () => assertIs(_string, {}),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, {}).message,
    );
  });
});
