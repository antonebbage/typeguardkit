import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { TypeAssertionError } from '../mod.ts';
import { _number } from './number.ts';

describe('_number', () => {
  it('should return `value` if of type `number`', () => {
    assertStrictEquals(_number(0), 0);
    assertStrictEquals(_number(1), 1);
  });

  it('should throw a `TypeAssertionError` with correct `message` if `value` not of type `number`', () => {
    assertThrows(
      () => _number(undefined, 'name'),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined, { valueName: 'name' })
        .message,
    );

    assertThrows(
      () => _number(undefined),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, undefined).message,
    );
    assertThrows(
      () => _number(null),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, null).message,
    );
    assertThrows(
      () => _number(false),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, false).message,
    );
    assertThrows(
      () => _number(''),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, '').message,
    );
    assertThrows(
      () => _number([]),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, []).message,
    );
    assertThrows(
      () => _number({}),
      TypeAssertionError,
      new TypeAssertionError(_number.typeName, {}).message,
    );
  });
});
