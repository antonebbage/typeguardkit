import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { TypeAssertionError } from '../mod.ts';
import { _string } from './string.ts';

describe('_string', () => {
  it('should return `value` if of type `string`', () => {
    assertStrictEquals(_string(''), '');
    assertStrictEquals(_string('a'), 'a');
  });

  it('should throw a `TypeAssertionError` with correct `message` if `value` not of type `string`', () => {
    assertThrows(
      () => _string(undefined, 'name'),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined, { valueName: 'name' })
        .message,
    );

    assertThrows(
      () => _string(undefined),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, undefined).message,
    );
    assertThrows(
      () => _string(null),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, null).message,
    );
    assertThrows(
      () => _string(false),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, false).message,
    );
    assertThrows(
      () => _string(0),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, 0).message,
    );
    assertThrows(
      () => _string([]),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, []).message,
    );
    assertThrows(
      () => _string({}),
      TypeAssertionError,
      new TypeAssertionError(_string.typeName, {}).message,
    );
  });
});
