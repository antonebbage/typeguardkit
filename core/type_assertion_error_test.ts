import {
  assert,
  assertExists,
  assertObjectMatch,
  assertStrictEquals,
  assertStringIncludes,
} from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

describe("TypeAssertionError", () => {
  it("should extend `TypeError`", () => {
    assert(new TypeAssertionError("", "") instanceof TypeError);
  });

  it("should set correct `message` and `issueTree`", () => {
    let error = new TypeAssertionError("ExpectedType", "", {
      valueName: "name",
    });

    assertStrictEquals(
      error.message,
      "`name` is of type `string`; expected type of `ExpectedType`",
    );

    let issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "name",
      actualTypeName: "string",
      expectedTypeName: "ExpectedType",
      issues: undefined,
    });

    error = new TypeAssertionError("ExpectedType", "");

    assertStrictEquals(
      error.message,
      "`value` is of type `string`; expected type of `ExpectedType`",
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "value",
      actualTypeName: "string",
      expectedTypeName: "ExpectedType",
      issues: undefined,
    });

    error = new TypeAssertionError("ExpectedOuterType", {}, {
      valueName: "outerValue",

      issues: new TypeAssertionError("ExpectedInnerType", "", {
        valueName: "innerValue",
      }),
    });

    assertStrictEquals(
      error.message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        "  - `.innerValue` is of type `string`; expected type of `ExpectedInnerType`",
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "outerValue",
      actualTypeName: "Object",
      expectedTypeName: "ExpectedOuterType",
    });

    assertStrictEquals(issueTree.issues?.length, 1);

    let issue = issueTree.issues[0];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "innerValue",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType",
      issues: undefined,
    });

    error = new TypeAssertionError("ExpectedOuterType", {}, {
      valueName: "outerValue",

      issues: [
        new TypeAssertionError("ExpectedInnerType1", "", {
          valueName: "0",
        }),

        new TypeAssertionError("ExpectedInnerType2", "", {
          valueName: "1.0",
        }),

        new TypeAssertionError("ExpectedInnerType3", "", {
          valueName: "2.5",
        }),
      ],
    });

    assertStrictEquals(
      error.message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        "  - `[0]` is of type `string`; expected type of `ExpectedInnerType1`\n" +
        '  - `["1.0"]` is of type `string`; expected type of `ExpectedInnerType2`\n' +
        '  - `["2.5"]` is of type `string`; expected type of `ExpectedInnerType3`',
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "outerValue",
      actualTypeName: "Object",
      expectedTypeName: "ExpectedOuterType",
    });

    assertStrictEquals(issueTree.issues?.length, 3);

    issue = issueTree.issues[0];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "0",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType1",
      issues: undefined,
    });

    issue = issueTree.issues[1];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "1.0",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType2",
      issues: undefined,
    });

    issue = issueTree.issues[2];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "2.5",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType3",
      issues: undefined,
    });

    error = new TypeAssertionError("ExpectedType", "", { issues: "issue" });

    assertStrictEquals(
      error.message,
      "`value` is of type `string`; expected type of `ExpectedType`:\n" +
        "  - issue",
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "value",
      actualTypeName: "string",
      expectedTypeName: "ExpectedType",
    });

    assertStrictEquals(issueTree.issues?.length, 1);
    assertStrictEquals(issueTree.issues[0], "issue");

    error = new TypeAssertionError("ExpectedType", "", {
      issues: ["issue 1", "issue 2", "issue 3"],
    });

    assertStrictEquals(
      error.message,
      "`value` is of type `string`; expected type of `ExpectedType`:\n" +
        "  - issue 1\n" +
        "  - issue 2\n" +
        "  - issue 3",
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "value",
      actualTypeName: "string",
      expectedTypeName: "ExpectedType",
    });

    assertStrictEquals(issueTree.issues?.length, 3);

    assertStrictEquals(issueTree.issues[0], "issue 1");
    assertStrictEquals(issueTree.issues[1], "issue 2");
    assertStrictEquals(issueTree.issues[2], "issue 3");

    error = new TypeAssertionError("ExpectedOuterType", {}, {
      valueName: "outerValue",

      issues: [
        new TypeAssertionError("ExpectedInnerType1", "", {
          valueName: "inner-value-1",
          issues: ["issue 1.1", "issue 1.2", "issue 1.3"],
        }),

        new TypeAssertionError("ExpectedInnerType2", "", {
          valueName: "inner value 2",
          issues: ["issue 2.1", "issue 2.2", "issue 2.3"],
        }),

        new TypeAssertionError("ExpectedInnerType3", "", {
          valueName: "3rdInnerValue",
          issues: ["issue 3.1", "issue 3.2", "issue 3.3"],
        }),
      ],
    });

    assertStrictEquals(
      error.message,
      "`outerValue` is of type `Object`; expected type of `ExpectedOuterType`:\n" +
        '  - `["inner-value-1"]` is of type `string`; expected type of `ExpectedInnerType1`:\n' +
        "    - issue 1.1\n" +
        "    - issue 1.2\n" +
        "    - issue 1.3\n" +
        '  - `["inner value 2"]` is of type `string`; expected type of `ExpectedInnerType2`:\n' +
        "    - issue 2.1\n" +
        "    - issue 2.2\n" +
        "    - issue 2.3\n" +
        '  - `["3rdInnerValue"]` is of type `string`; expected type of `ExpectedInnerType3`:\n' +
        "    - issue 3.1\n" +
        "    - issue 3.2\n" +
        "    - issue 3.3",
    );

    issueTree = error.issueTree;

    assertObjectMatch(issueTree, {
      valueName: "outerValue",
      actualTypeName: "Object",
      expectedTypeName: "ExpectedOuterType",
    });

    assertStrictEquals(issueTree.issues?.length, 3);

    issue = issueTree.issues[0];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "inner-value-1",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType1",
    });

    assertStrictEquals(issue.issues?.length, 3);

    assertStrictEquals(issue.issues[0], "issue 1.1");
    assertStrictEquals(issue.issues[1], "issue 1.2");
    assertStrictEquals(issue.issues[2], "issue 1.3");

    issue = issueTree.issues[1];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "inner value 2",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType2",
    });

    assertStrictEquals(issue.issues?.length, 3);

    assertStrictEquals(issue.issues[0], "issue 2.1");
    assertStrictEquals(issue.issues[1], "issue 2.2");
    assertStrictEquals(issue.issues[2], "issue 2.3");

    issue = issueTree.issues[2];

    assert(typeof issue === "object");

    assertObjectMatch(issue, {
      valueName: "3rdInnerValue",
      actualTypeName: "string",
      expectedTypeName: "ExpectedInnerType3",
    });

    assertStrictEquals(issue.issues?.length, 3);

    assertStrictEquals(issue.issues[0], "issue 3.1");
    assertStrictEquals(issue.issues[1], "issue 3.2");
    assertStrictEquals(issue.issues[2], "issue 3.3");

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

describe("TypeAssertionError.issueTreeNode", () => {
  const error = new TypeAssertionError("ExpectedOuterType", {}, {
    valueName: "outerValue",

    issues: [
      new TypeAssertionError("ExpectedInnerLevel1Type1", "", {
        valueName: "0",

        issues: [
          new TypeAssertionError("ExpectedInnerLevel2Type1", "", {
            valueName: "innerLevel2Value1",

            issues: [
              new TypeAssertionError("ExpectedInnerLevel3Type1", "", {
                valueName: "inner-level-3-value-1",
              }),
            ],
          }),
        ],
      }),

      new TypeAssertionError("ExpectedInnerLevel1Type2", "", {
        valueName: "1",

        issues: [
          new TypeAssertionError("ExpectedInnerLevel2Type2", "", {
            valueName: "inner_level_2_value_2",

            issues: [
              new TypeAssertionError("ExpectedInnerLevel3Type2", "", {
                valueName: "inner level 3 value / 2",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  let node = error.issueTreeNode("0");

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "0",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel1Type1",
  });

  assertStrictEquals(node.issues?.length, 1);

  assert(typeof node.issues[0] === "object");
  assertStrictEquals(node.issues[0].valueName, "innerLevel2Value1");

  node = error.issueTreeNode("0/innerLevel2Value1");

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "innerLevel2Value1",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel2Type1",
  });

  assertStrictEquals(node.issues?.length, 1);

  assert(typeof node.issues[0] === "object");
  assertStrictEquals(node.issues[0].valueName, "inner-level-3-value-1");

  node = error.issueTreeNode("0/innerLevel2Value1/inner-level-3-value-1");

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "inner-level-3-value-1",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel3Type1",
    issues: undefined,
  });

  node = error.issueTreeNode("1");

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "1",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel1Type2",
  });

  assertStrictEquals(node.issues?.length, 1);

  assert(typeof node.issues[0] === "object");
  assertStrictEquals(node.issues[0].valueName, "inner_level_2_value_2");

  node = error.issueTreeNode("1/inner_level_2_value_2");

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "inner_level_2_value_2",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel2Type2",
  });

  assertStrictEquals(node.issues?.length, 1);

  assert(typeof node.issues[0] === "object");
  assertStrictEquals(node.issues[0].valueName, "inner level 3 value / 2");

  node = error.issueTreeNode(
    "1/inner_level_2_value_2/inner level 3 value \\/ 2",
  );

  assertExists(node);

  assertObjectMatch(node, {
    valueName: "inner level 3 value / 2",
    actualTypeName: "string",
    expectedTypeName: "ExpectedInnerLevel3Type2",
    issues: undefined,
  });
});

describe("TypeAssertionError.toJSON", () => {
  const error = new TypeAssertionError("ExpectedOuterType", {}, {
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
  });

  assertStrictEquals(error.toJSON(), JSON.stringify(error.issueTree));
});
