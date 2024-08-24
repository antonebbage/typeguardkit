// This module is browser-compatible.

/*
 * A `Validator<Type>` has a `validate` method, which should check `value` meets
 * any runtime-only constraints of `Type`, and return any issues. This should
 * not include constraints of any `Validator`s for properties or elements of
 * `Type`.
 *
 * Any `Asserter<Type>` class that allows runtime-only constraints should also
 * implement `Validator<Type>`.
 *
 * `validate` can then be used to validate user input client side, where it
 * should already be known that `value` meets the compile-time constraints of
 * `Type`.
 */
export interface Validator<Type> {
  validate(value: Type): string[];
}
