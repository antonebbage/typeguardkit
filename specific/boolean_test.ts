import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { TypeAssertionError } from '../mod.ts';
import { _boolean } from './boolean.ts';

describe('_boolean', () => {
  it('should return `value` if of type `boolean`', () => {
    assertStrictEquals(_boolean(false), false);
    assertStrictEquals(_boolean(true), true);
  });

  it('should throw a `TypeAssertionError` with correct `message` if `value` not of type `boolean`', () => {
    assertThrows(
      () => _boolean(undefined, 'name'),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, undefined, {
        valueName: 'name',
      }).message,
    );

    assertThrows(
      () => _boolean(undefined),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, undefined).message,
    );
    assertThrows(
      () => _boolean(null),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, null).message,
    );
    assertThrows(
      () => _boolean(0),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, 0).message,
    );
    assertThrows(
      () => _boolean(''),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, '').message,
    );
    assertThrows(
      () => _boolean([]),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, []).message,
    );
    assertThrows(
      () => _boolean({}),
      TypeAssertionError,
      new TypeAssertionError(_boolean.typeName, {}).message,
    );
  });
});
