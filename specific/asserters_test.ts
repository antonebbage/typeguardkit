import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { _boolean, _number, _string } from './asserters.ts';
import { TypeAssertionError } from './type_assertion_error.ts';

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
