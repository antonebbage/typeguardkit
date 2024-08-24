// This module is browser-compatible.

/**
 * An `Asserter<Type>` has a type assertion method, `assert`, which should
 * assert whether the provided `value` is of `Type`.
 *
 * If `value` is of `Type`, `assert` should return `value` as `Type`. Otherwise,
 * `assert` should throw a `TypeAssertionError`, including `valueName` in its
 * `message`.
 */
export interface Asserter<Type> {
  readonly typeName: string;

  assert(value: unknown, valueName?: string): Type;
}
