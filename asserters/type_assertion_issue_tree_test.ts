import { assertStrictEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { TypeAssertionError, TypeAssertionIssueTree } from "../mod.ts";
import { _TypeAssertionIssueTree } from "./type_assertion_issue_tree.ts";

describe("_TypeAssertionIssueTree", () => {
  it('should have a `typeName` of `"TypeAssertionIssueTree"`', () => {
    assertStrictEquals(
      _TypeAssertionIssueTree.typeName,
      "TypeAssertionIssueTree",
    );
  });

  it("`assert` should return `value` if of type `TypeAssertionIssueTree`", () => {
    const testCases: TypeAssertionIssueTree[] = [
      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",

        issues: [
          {
            valueName: "value1",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",
          },

          {
            valueName: "value2",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",
          },

          {
            valueName: "value3",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",
          },
        ],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: ["issue 1", "issue 2", "issue 3"],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",

        issues: [
          {
            valueName: "value",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",
          },

          "issue",
        ],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",

        issues: [
          {
            valueName: "value",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",

            issues: [
              {
                valueName: "value",
                actualTypeName: "ActualType",
                expectedTypeName: "ExpectedType",

                issues: [
                  {
                    valueName: "value",
                    actualTypeName: "ActualType",
                    expectedTypeName: "ExpectedType",

                    issues: ["issue"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    for (const value of testCases) {
      assertStrictEquals(_TypeAssertionIssueTree.assert(value), value);
    }
  });

  it("`assert` should throw a `TypeAssertionError` with correct `message` if `value` not of type `TypeAssertionIssueTree`", () => {
    assertThrows(
      () => _TypeAssertionIssueTree.assert(undefined, "name"),
      TypeAssertionError,
      new TypeAssertionError(_TypeAssertionIssueTree.typeName, undefined, {
        valueName: "name",
      })
        .message,
    );

    assertThrows(
      () => _TypeAssertionIssueTree.assert(undefined),
      TypeAssertionError,
      new TypeAssertionError(_TypeAssertionIssueTree.typeName, undefined)
        .message,
    );

    const testCases = [
      undefined,
      null,
      false,
      0,
      "",
      [],
      {},

      {
        valueName: undefined,
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: null,
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: false,
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: 0,
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: [],
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: {},
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: undefined,
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: null,
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: false,
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: 0,
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: [],
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: {},
        expectedTypeName: "ExpectedType",
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: undefined,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: null,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: false,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: 0,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: [],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: {},
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: null,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: false,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: 0,
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: "",
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: {},
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [undefined],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [null],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [false],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [0],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [[]],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",
        issues: [{}],
      },

      {
        valueName: "value",
        actualTypeName: "ActualType",
        expectedTypeName: "ExpectedType",

        issues: [
          {
            valueName: "value",
            actualTypeName: "ActualType",
            expectedTypeName: "ExpectedType",

            issues: [
              {
                valueName: "value",
                actualTypeName: "ActualType",
                expectedTypeName: "ExpectedType",

                issues: [
                  {
                    valueName: "value",
                    actualTypeName: "ActualType",
                    expectedTypeName: "ExpectedType",
                    issues: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    for (const value of testCases) {
      assertThrows(
        () => _TypeAssertionIssueTree.assert(value),
        TypeAssertionError,
        new TypeAssertionError(_TypeAssertionIssueTree.typeName, value).message,
      );
    }
  });
});
