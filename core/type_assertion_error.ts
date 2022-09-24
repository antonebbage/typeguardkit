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
 * A `TypeAssertionError` should be thrown from an `Asserter<Type>` when `value`
 * is not of `Type`.
 */
export class TypeAssertionError extends Error {
  constructor(
    expectedTypeName: string,
    value: unknown,
    options: TypeAssertionErrorOptions = {},
  ) {
    const actualTypeName = typeof value === "object"
      ? value === null ? "null" : value.constructor.name
      : typeof value;

    const valueName = options.valueName ? options.valueName : "value";

    let message =
      `\`${valueName}\` is of type \`${actualTypeName}\`; expected type of \`${expectedTypeName}\``;

    if (options.issues) {
      message += ":";

      const issues = Array.isArray(options.issues)
        ? options.issues
        : [options.issues];

      for (const issue of issues) {
        message += `\n- ${
          issue instanceof TypeAssertionError ? issue.message : issue
        }`;
      }

      message = message.replaceAll("\n", "\n  ");
    }

    super(message);

    if (Error.captureStackTrace) {
      // Maintains proper stack trace for where the error was thrown (only
      // available on V8). Source:
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types

      Error.captureStackTrace(this, TypeAssertionError);
    }

    this.name = "TypeAssertionError";
  }
}
