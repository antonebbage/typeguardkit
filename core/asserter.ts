// This module is browser-compatible.

/**
 * An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeAssertionError`, including `valueName` in its `message`.
 */
export interface Asserter<Type> {
  (value: unknown, valueName?: string): Type;

  readonly asserterTypeName: string;
  readonly assertedTypeName: string;
}
