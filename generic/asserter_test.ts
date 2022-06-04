import {
  assertInstanceOf,
  assertNotStrictEquals,
  assertStrictEquals,
  assertStringIncludes,
  assertThrows,
  describe,
  it,
} from '/dev_deps.ts';
import { type, TypeAssertionError } from './asserter.ts';

describe('TypeAssertionError', () => {
  it('should set correctly formatted `message`', () => {
    assertStrictEquals(
      new TypeAssertionError('expectedTypeName', '').message,
      '`value` is of type `string`; expected type of `expectedTypeName`',
    );

    assertStrictEquals(
      new TypeAssertionError('expectedOuterTypeName', {}, {
        innerError: new TypeAssertionError('expectedInnerTypeName', '', {
          valueName: 'innerValueName',
        }),
      }).message,
      '`value` is of type `Object`; expected type of `expectedOuterTypeName`:\n  - `innerValueName` is of type `string`; expected type of `expectedInnerTypeName`',
    );
  });

  it('should set `message` including type of `value`', () => {
    assertStringIncludes(
      new TypeAssertionError('', undefined).message,
      'is of type `undefined`',
    );
    assertStringIncludes(
      new TypeAssertionError('', null).message,
      'is of type `null`',
    );
    assertStringIncludes(
      new TypeAssertionError('', false).message,
      'is of type `boolean`',
    );
    assertStringIncludes(
      new TypeAssertionError('', 0).message,
      'is of type `number`',
    );
    assertStringIncludes(
      new TypeAssertionError('', []).message,
      'is of type `Array`',
    );
    assertStringIncludes(
      new TypeAssertionError('', {}).message,
      'is of type `Object`',
    );
  });
});

describe('type', () => {
  const _string = type(
    'string',
    (value): value is string => typeof value === 'string',
  );

  const _object = type(
    'Record<string, unknown>',
    (value): value is Record<string, unknown> =>
      typeof value === 'object' && !Array.isArray(value) && value !== null,
  );

  it('should return a `Function` with `typeName` set to `name`', () => {
    assertInstanceOf(_string, Function);
    assertInstanceOf(_object, Function);

    assertStrictEquals(_string.typeName, 'string');
    assertStrictEquals(_object.typeName, 'Record<string, unknown>');
  });

  it(
    'should return a `Function` that returns `value` when `guard` returns `true` for `value`',
    () => {
      assertStrictEquals(_string(''), '');
      assertStrictEquals(_string('a'), 'a');

      const object = {};
      assertStrictEquals(_object(object), object);

      assertNotStrictEquals(_object({}), {});
    },
  );

  it('should return a `Function` that throws a `TypeAssertionError` with correct `message` when `guard` returns `false` for `value`', () => {
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

    assertThrows(
      () => _object(undefined),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, undefined).message,
    );
    assertThrows(
      () => _object(null),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, null).message,
    );
    assertThrows(
      () => _object(false),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, false).message,
    );
    assertThrows(
      () => _object(0),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, 0).message,
    );
    assertThrows(
      () => _object(''),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, '').message,
    );
    assertThrows(
      () => _object([]),
      TypeAssertionError,
      new TypeAssertionError(_object.typeName, []).message,
    );
  });
});
