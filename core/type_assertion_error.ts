// This module is browser-compatible.

/**
 * `TypeAssertionErrorOptions` can be passed to the `TypeAssertionError`
 * constructor.
 */
export interface TypeAssertionErrorOptions {
  readonly valueName?: string;
  readonly issues?: Readonly<TypeAssertionError[] | string[]>;
}

/**
 * A `TypeAssertionError` should be thrown from an `Asserter<Type>` when `value`
 * is not of `Type`.
 */
export class TypeAssertionError extends TypeError {
  constructor(
    expectedTypeName: string,
    value: unknown,
    options: TypeAssertionErrorOptions = {},
  ) {
    const actualTypeName = typeof value === "object"
      ? value === null ? "null" : value.constructor.name
      : typeof value;

    const valueName = options.valueName || "value";

    let message = `\`${valueName}\` is ${
      value === missingProperty ? "missing" : `of type \`${actualTypeName}\``
    }; expected type of \`${expectedTypeName}\``;

    if (options.issues) {
      message += ":";

      let issueMessages;

      if (typeof options.issues[0] === "string") {
        issueMessages = options.issues as readonly string[];
      } else {
        issueMessages = (options.issues as TypeAssertionError[]).map((
          { message },
        ) => message);
      }

      message += issueMessages.reduce(
        (message, issue) => `${message}\n- ${issue}`,
        "",
      );

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

/**
 * `missingProperty` can be passed to the `TypeAssertionError` constructor as
 * `value` to denote a missing object property, as distinct from one set to
 * `undefined`.
 */
export const missingProperty = Symbol("missingProperty");
