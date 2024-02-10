// This module is browser-compatible.

import { TypeAsserter, TypeAssertionIssueTree } from "../core/mod.ts";

/** `_TypeAssertionIssueTree` is a `TypeAsserter<TypeAssertionIssueTree>`. */
export const _TypeAssertionIssueTree = new TypeAsserter(
  "TypeAssertionIssueTree",
  isTypeAssertionIssueTree,
);

function isTypeAssertionIssueTree(
  value: unknown,
): value is TypeAssertionIssueTree {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const val = value as Record<string, unknown>;

  if (
    typeof val.valueName !== "string" ||
    typeof val.actualTypeName !== "string" ||
    typeof val.expectedTypeName !== "string"
  ) {
    return false;
  }

  if (val.issues !== undefined) {
    if (!Array.isArray(val.issues)) {
      return false;
    }

    for (const issue of val.issues) {
      if (!isTypeAssertionIssueTree(issue) && typeof issue !== "string") {
        return false;
      }
    }
  }

  return true;
}
