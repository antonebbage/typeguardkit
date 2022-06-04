// This module is browser-compatible.

/** An `Asserter` is a type assertion function. If `value` is of `Type`, it
 * should return `value` as `Type`. Otherwise, it should throw a `TypeError`
 * with a message created by the `errorMessage` function. */
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
