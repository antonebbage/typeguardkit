import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { errorMessage } from '../mod.ts';
import { _string } from './string.ts';

describe('_string', () => {
  it('should return `value` if of type `string`', () => {
    assertStrictEquals(_string(''), '');
    assertStrictEquals(_string('a'), 'a');
  });

  it('should throw a `TypeError` with correct message if `value` not of type `string`', () => {
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
  });
});
