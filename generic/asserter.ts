// This module is browser-compatible.

/** An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeAssertionError`. */
export interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}

/** `TypeAssertionErrorOptions` can be passed to the `TypeAssertionError`
 * constructor. */
export interface TypeAssertionErrorOptions {
  valueName?: string;
  innerError?: TypeAssertionError;
}

/** A `TypeAssertionError` should be thrown from an `Asserter<Type>` when the
 * value passed in is not of `Type`. */
export class TypeAssertionError extends Error {
  constructor(
    expectedTypeName: string,
    value: unknown,
    options: TypeAssertionErrorOptions = {},
  ) {
    const actualTypeName = typeof value === 'object'
      ? value === null ? 'null' : value.constructor.name
      : typeof value;

    const valueName = options.valueName ? options.valueName : 'value';

    let message =
      `\`${valueName}\` is of type \`${actualTypeName}\`; expected type of \`${expectedTypeName}\``;

    if (options.innerError) {
      message += `:\n  - ${options.innerError.message}`;
    }

    super(message);

    // Maintains proper stack trace for where our error was thrown (only
    // available on V8)
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TypeAssertionError);
    }

    this.name = 'TypeAssertionError';
  }
}

/** `type` returns an `Asserter<Type>` that uses `guard` to assert whether
 * `value` is of `Type`. */
export function type<Type>(
  name: string,
  guard: (value: unknown) => value is Type,
): Asserter<Type> {
  const typeName = name;

  const asserter = (value: unknown, valueName?: string) => {
    if (guard(value)) {
      return value;
    }
    throw new TypeAssertionError(typeName, value, { valueName });
  };

  asserter.typeName = typeName;

  return asserter;
}
