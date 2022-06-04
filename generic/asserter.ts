// This module is browser-compatible.

/** An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeError` with a message created by the `errorMessage` function. */
export interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}

/** `errorMessage` returns an `Asserter` `TypeError` message. */
export function errorMessage(
  value: unknown,
  expectedTypeName: string,
  valueName = 'value',
): string {
  const actualTypeName = typeof value === 'object'
    ? value === null ? 'null' : value.constructor.name
    : typeof value;

  return `\`${valueName}\` is of type \`${actualTypeName}\`; expected type of \`${expectedTypeName}\``;
}

/** `type` returns an `Asserter<Type>` that uses `guard` to assert whether
 * `value` is of `Type`. */
export function type<Type>(
  name: string,
  guard: (value: unknown) => value is Type,
): Asserter<Type> {
  const asserter = (value: unknown, valueName?: string) => {
    if (guard(value)) {
      return value;
    }
    throw new TypeError(errorMessage(value, name, valueName));
  };

  asserter.typeName = name;

  return asserter;
}
