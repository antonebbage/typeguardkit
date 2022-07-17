import {
  assertStrictEquals,
  assertStringIncludes,
  describe,
  it,
} from "/dev_deps.ts";
import { _number, _string } from "./asserters.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

describe("TypeAssertionError", () => {
  it("should set correctly formatted `message`", () => {
    assertStrictEquals(
      new TypeAssertionError("expectedTypeName", "").message,
      "`value` is of type `string`; expected type of `expectedTypeName`",
    );

    assertStrictEquals(
      new TypeAssertionError("expectedOuterTypeName", {}, {
        innerError: new TypeAssertionError("expectedInnerTypeName", "", {
          valueName: "innerValueName",
        }),
      })
        .message,
      "`value` is of type `Object`; expected type of `expectedOuterTypeName`:\n  - `innerValueName` is of type `string`; expected type of `expectedInnerTypeName`",
    );
  });

  it("should set `message` including type of `value`", () => {
    const testCases = [
      { value: undefined, expectedMessage: "is of type `undefined`" },
      { value: null, expectedMessage: "is of type `null`" },
      { value: false, expectedMessage: "is of type `boolean`" },
      { value: 0, expectedMessage: "is of type `number`" },
      { value: "", expectedMessage: "is of type `string`" },
      { value: [], expectedMessage: "is of type `Array`" },
      { value: {}, expectedMessage: "is of type `Object`" },
    ];

    for (const { value, expectedMessage } of testCases) {
      assertStringIncludes(
        new TypeAssertionError("", value).message,
        expectedMessage,
      );
    }
  });
});
