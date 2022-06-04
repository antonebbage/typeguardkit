import {
  assertInstanceOf,
  assertNotStrictEquals,
  assertStrictEquals,
  assertStringIncludes,
  assertThrows,
  describe,
  it,
} from '/dev_deps.ts';
import { errorMessage, type } from './asserter.ts';

describe('errorMessage', () => {
  it('should return correctly formatted message', () => {
    assertStrictEquals(
      errorMessage('', 'expectedTypeName1', 'valueName1'),
      '`valueName1` is of type `string`; expected type of `expectedTypeName1`',
    );
  });

  it('should return message including defined `valueName`', () => {
    assertStringIncludes(
      errorMessage('', '', 'valueName2'),
      '`valueName2` is of type',
    );
  });

  it('should return message including default `valueName` if `undefined`', () => {
    assertStringIncludes(errorMessage('', ''), '`value` is of type');
  });

  it('should return message including type of `value`', () => {
    assertStringIncludes(errorMessage(undefined, ''), 'is of type `undefined`');
    assertStringIncludes(errorMessage(null, ''), 'is of type `null`');
    assertStringIncludes(errorMessage(false, ''), 'is of type `boolean`');
    assertStringIncludes(errorMessage(0, ''), 'is of type `number`');
    assertStringIncludes(errorMessage([], ''), 'is of type `Array`');
    assertStringIncludes(errorMessage({}, ''), 'is of type `Object`');
  });

  it('should return message including `expectedTypeName`', () => {
    assertStringIncludes(
      errorMessage('', 'expectedTypeName2'),
      'expected type of `expectedTypeName2`',
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

  it('should return a `Function` that throws a `TypeError` with correct message when `guard` returns `false` for `value`', () => {
    assertThrows(
      () => _string(undefined, 'name'),
      TypeError,
      errorMessage(undefined, 'string', 'name'),
    );

    assertThrows(
      () => _string(undefined),
      TypeError,
      errorMessage(undefined, 'string'),
    );
    assertThrows(
      () => _string(null),
      TypeError,
      errorMessage(null, 'string'),
    );
    assertThrows(
      () => _string(false),
      TypeError,
      errorMessage(false, 'string'),
    );
    assertThrows(() => _string(0), TypeError, errorMessage(0, 'string'));
    assertThrows(() => _string([]), TypeError, errorMessage([], 'string'));
    assertThrows(() => _string({}), TypeError, errorMessage({}, 'string'));

    assertThrows(
      () => _object(undefined),
      TypeError,
      errorMessage(undefined, 'Record<string, unknown>'),
    );
    assertThrows(
      () => _object(null),
      TypeError,
      errorMessage(null, 'Record<string, unknown>'),
    );
    assertThrows(
      () => _object(false),
      TypeError,
      errorMessage(false, 'Record<string, unknown>'),
    );
    assertThrows(
      () => _object(0),
      TypeError,
      errorMessage(0, 'Record<string, unknown>'),
    );
    assertThrows(
      () => _object(''),
      TypeError,
      errorMessage('', 'Record<string, unknown>'),
    );
    assertThrows(
      () => _object([]),
      TypeError,
      errorMessage([], 'Record<string, unknown>'),
    );
  });
});
