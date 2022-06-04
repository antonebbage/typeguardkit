import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { errorMessage } from '../mod.ts';
import { _boolean } from './boolean.ts';

describe('_boolean', () => {
  it('should return `value` if of type `boolean`', () => {
    assertStrictEquals(_boolean(false), false);
    assertStrictEquals(_boolean(true), true);
  });

  it('should throw a `TypeError` with correct message if `value` not of type `boolean`', () => {
    assertThrows(
      () => _boolean(undefined, 'name'),
      TypeError,
      errorMessage(undefined, 'boolean', 'name'),
    );

    assertThrows(
      () => _boolean(undefined),
      TypeError,
      errorMessage(undefined, 'boolean'),
    );
    assertThrows(
      () => _boolean(null),
      TypeError,
      errorMessage(null, 'boolean'),
    );
    assertThrows(() => _boolean(0), TypeError, errorMessage(0, 'boolean'));
    assertThrows(() => _boolean(''), TypeError, errorMessage('', 'boolean'));
    assertThrows(() => _boolean([]), TypeError, errorMessage([], 'boolean'));
    assertThrows(() => _boolean({}), TypeError, errorMessage({}, 'boolean'));
  });
});
