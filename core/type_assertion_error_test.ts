import { assertStrictEquals, assertStringIncludes } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

describe("TypeAssertionError", () => {
  it("should set correct `message`", () => {
    assertStrictEquals(
      new TypeAssertionError("ExpectedType", "", { valueName: "name" }).message,
      "`name` is of type `string`; expected type of `ExpectedType`",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedType", "").message,
      "`value` is of type `string`; expected type of `ExpectedType`",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedOuterType", {}, {
        valueName: "outerValue",

        issues: new TypeAssertionError("ExpectedInnerType", "", {
          valueName: "innerValue",
        }),
      })
        .message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        "  - `innerValue` is of type `string`; expected type of `ExpectedInnerType`",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedOuterType", {}, {
        valueName: "outerValue",

        issues: [
          new TypeAssertionError("ExpectedInnerType1", "", {
            valueName: "innerValue1",
          }),

          new TypeAssertionError("ExpectedInnerType2", "", {
            valueName: "innerValue2",
          }),

          new TypeAssertionError("ExpectedInnerType3", "", {
            valueName: "innerValue3",
          }),
        ],
      })
        .message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        "  - `innerValue1` is of type `string`; expected type of `ExpectedInnerType1`\n" +
        "  - `innerValue2` is of type `string`; expected type of `ExpectedInnerType2`\n" +
        "  - `innerValue3` is of type `string`; expected type of `ExpectedInnerType3`",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedType", "", { issues: "issue" }).message,
      "`value` is of type `string`; expected type of `ExpectedType`:\n" +
        "  - issue",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedType", "", {
        issues: ["issue 1", "issue 2", "issue 3"],
      })
        .message,
      "`value` is of type `string`; expected type of `ExpectedType`:\n" +
        "  - issue 1\n" +
        "  - issue 2\n" +
        "  - issue 3",
    );

    assertStrictEquals(
      new TypeAssertionError("ExpectedOuterType", {}, {
        valueName: "outerValue",

        issues: [
          new TypeAssertionError("ExpectedInnerType1", "", {
            valueName: "innerValue1",
            issues: ["issue 1.1", "issue 1.2", "issue 1.3"],
          }),

          new TypeAssertionError("ExpectedInnerType2", "", {
            valueName: "innerValue2",
            issues: ["issue 2.1", "issue 2.2", "issue 2.3"],
          }),

          new TypeAssertionError("ExpectedInnerType3", "", {
            valueName: "innerValue3",
            issues: ["issue 3.1", "issue 3.2", "issue 3.3"],
          }),
        ],
      })
        .message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        "  - `innerValue1` is of type `string`; expected type of `ExpectedInnerType1`:\n" +
        "    - issue 1.1\n" +
        "    - issue 1.2\n" +
        "    - issue 1.3\n" +
        "  - `innerValue2` is of type `string`; expected type of `ExpectedInnerType2`:\n" +
        "    - issue 2.1\n" +
        "    - issue 2.2\n" +
        "    - issue 2.3\n" +
        "  - `innerValue3` is of type `string`; expected type of `ExpectedInnerType3`:\n" +
        "    - issue 3.1\n" +
        "    - issue 3.2\n" +
        "    - issue 3.3",
    );

    const valueTypeTestCases = [
      { value: undefined, expectedMessage: "is of type `undefined`" },
      { value: null, expectedMessage: "is of type `null`" },
      { value: false, expectedMessage: "is of type `boolean`" },
      { value: 0, expectedMessage: "is of type `number`" },
      { value: "", expectedMessage: "is of type `string`" },
      { value: [], expectedMessage: "is of type `Array`" },
      { value: {}, expectedMessage: "is of type `Object`" },
    ];

    for (const { value, expectedMessage } of valueTypeTestCases) {
      assertStringIncludes(
        new TypeAssertionError("", value).message,
        expectedMessage,
      );
    }
  });
});
