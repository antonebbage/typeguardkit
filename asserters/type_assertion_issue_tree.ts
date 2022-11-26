// This module is browser-compatible.

import { typeAsserter, TypeAssertionIssueTree } from "../core/mod.ts";

/**
 * `_TypeAssertionIssueTree` is a `TypeAssertionIssueTree` type assertion
 * function. If `value` is a `TypeAssertionIssueTree`, `_TypeAssertionIssueTree`
 * returns `value` as `TypeAssertionIssueTree`. Otherwise,
 * `_TypeAssertionIssueTree` throws a `TypeAssertionError`, including `name` in
 * its `message`.
 */
export const _TypeAssertionIssueTree = typeAsserter(
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
