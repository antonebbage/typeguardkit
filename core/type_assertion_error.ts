// This module is browser-compatible.

/**
 * `TypeAssertionErrorOptions` can be passed to the `TypeAssertionError`
 * constructor.
 */
export interface TypeAssertionErrorOptions {
  readonly valueName?: string;

  readonly issues?:
    | TypeAssertionError
    | readonly TypeAssertionError[]
    | string
    | readonly string[];
}

/**
 * A `TypeAssertionIssueTreeNode` is a node of a tree representation of the
 * issues of a `TypeAssertionError`.
 */
export interface TypeAssertionIssueTreeNode {
  readonly valueName: string;
  readonly actualTypeName: string;
  readonly expectedTypeName: string;
  readonly issues?: ReadonlyArray<TypeAssertionIssueTreeNode | string>;
}

/**
 * `TypeAssertionIssueTree` is an alias of `TypeAssertionIssueTreeNode` for
 * typing the root `TypeAssertionErrorTreeNode`.
 */
export type TypeAssertionIssueTree = TypeAssertionIssueTreeNode;

/**
 * A `TypeAssertionError` should be thrown from an `Asserter<Type>` when `value`
 * is not of `Type`.
 *
 * You can create a `TypeAssertionError` from a `TypeAssertionIssueTree`
 * received from outside of the program by passing only that `issueTree` to
 * the constructor.
 */
export class TypeAssertionError extends Error {
  readonly issueTree: TypeAssertionIssueTree;

  constructor(issueTree: TypeAssertionIssueTree);

  constructor(
    expectedTypeName: string,
    value: unknown,
    options?: TypeAssertionErrorOptions,
  );

  constructor(
    expectedTypeNameOrIssueTree: string | TypeAssertionIssueTree,
    value?: unknown,
    options: TypeAssertionErrorOptions = {},
  ) {
    let issueTree;

    if (typeof expectedTypeNameOrIssueTree === "object") {
      issueTree = expectedTypeNameOrIssueTree;
    } else {
      const expectedTypeName = expectedTypeNameOrIssueTree;

      const actualTypeName = typeof value === "object"
        ? value === null ? "null" : value.constructor.name
        : typeof value;

      const valueName = options.valueName || "value";

      let issues: Array<TypeAssertionIssueTreeNode | string> | undefined;

      if (options.issues) {
        issues = [];

        for (
          const issue of Array.isArray(options.issues)
            ? options.issues
            : [options.issues]
        ) {
          issues.push(
            issue instanceof TypeAssertionError ? issue.issueTree : issue,
          );
        }
      }

      issueTree = { valueName, actualTypeName, expectedTypeName, issues };
    }

    super(TypeAssertionError.#issueTreeToMessage(issueTree, { isRoot: true }));

    if (Error.captureStackTrace) {
      // Maintains proper stack trace for where the error was thrown (only
      // available on V8). Source:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types

      Error.captureStackTrace(this, TypeAssertionError);
    }

    this.name = "TypeAssertionError";

    this.issueTree = issueTree;
  }

  /**
   * `issueTreeNode` returns the `TypeAssertionIssueTreeNode` at `path`, or
   * `undefined` if not found.
   *
   * The `path` separator is a forward slash, and can be escaped with 2
   * backslashes, or just 1 if using the `String.raw` template literal tag. A
   * `path` segment can be an object property name or array index.
   *
   * Example:
   *
   * ```ts
   * import {
   *   _NonNegativeInteger,
   *   _string,
   *   assertIs,
   *   is,
   *   ObjectAsserter,
   *   objectAsserter,
   *   TypeAssertionError,
   * } from "../mod.ts";
   *
   * // types/item.ts
   *
   * const itemAsserter = objectAsserter("Item", {
   *   quantity: _NonNegativeInteger,
   * });
   *
   * export type Item = ReturnType<typeof itemAsserter>;
   *
   * export const _Item: ObjectAsserter<Item> = itemAsserter;
   *
   * // types/form.ts
   *
   * const formAsserter = objectAsserter("Form", {
   *   item: _Item,
   * });
   *
   * export type Form = ReturnType<typeof formAsserter>;
   *
   * export const _Form: ObjectAsserter<Form> = formAsserter;
   *
   * // elsewhere.ts
   *
   * const form: Form = {
   *   item: {
   *     quantity: 0,
   *   },
   * };
   *
   * let itemQuantityIssues: string[] = [];
   *
   * function validateForm(): boolean {
   *   try {
   *     assertIs(_Form, form);
   *   } catch (error) {
   *     if (error instanceof TypeAssertionError) {
   *       const node = error.issueTreeNode("item/quantity");
   *
   *       itemQuantityIssues = node?.issues
   *         ? node.issues.filter((issue) => is(_string, issue)) as string[]
   *         : [];
   *     }
   *
   *     return false;
   *   }
   *
   *   return true;
   * }
   * ```
   */
  issueTreeNode(path: string): TypeAssertionIssueTreeNode | undefined {
    const escapedSeparatorParts = path.split("\\/").map((part) =>
      part.split("/")
    );

    const pathParts = escapedSeparatorParts[0];

    for (let i = 1; i < escapedSeparatorParts.length; i++) {
      pathParts[pathParts.length - 1] += `/${escapedSeparatorParts[i][0]}`;
      pathParts.push(...escapedSeparatorParts[i].splice(1));
    }

    return TypeAssertionError.#findIssueTreeNode(this.issueTree, pathParts);
  }

  /** `toJSON` returns a JSON representation of the `issueTree`. */
  toJSON(): string {
    return JSON.stringify(this.issueTree);
  }

  static #findIssueTreeNode(
    parentNode: TypeAssertionIssueTreeNode,
    pathParts: string[],
  ): TypeAssertionIssueTreeNode | undefined {
    const childNode = parentNode.issues?.find((issue) =>
      typeof issue === "object" && issue.valueName === pathParts[0]
    ) as TypeAssertionIssueTreeNode | undefined;

    if (!childNode) {
      return;
    }
    if (pathParts.length === 1) {
      return childNode;
    }

    return this.#findIssueTreeNode(childNode, pathParts.slice(1));
  }

  static #issueTreeToMessage(
    node: TypeAssertionIssueTreeNode,
    { isRoot }: { isRoot: boolean },
  ): string {
    let valueName;

    if (isRoot) {
      valueName = node.valueName;
    } else if (node.valueName === `${parseInt(node.valueName)}`) {
      valueName = `[${node.valueName}]`;
    } else if (/\W|^\d/.test(node.valueName)) {
      valueName = `["${node.valueName}"]`;
    } else {
      valueName = `.${node.valueName}`;
    }

    let message =
      `\`${valueName}\` is of type \`${node.actualTypeName}\`; expected type of \`${node.expectedTypeName}\``;

    if (node.issues) {
      message += ":";

      message += node.issues.reduce(
        (message, issue) =>
          `${message}\n- ` +
          (typeof issue === "object"
            ? this.#issueTreeToMessage(issue, { isRoot: false })
            : issue),
        "",
      );

      message = message.replaceAll("\n", "\n  ");
    }

    return message;
  }
}
