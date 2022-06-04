import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { errorMessage } from '../mod.ts';
import { _number } from './number.ts';

describe('_number', () => {
  it('should return `value` if of type `number`', () => {
    assertStrictEquals(_number(0), 0);
    assertStrictEquals(_number(1), 1);
  });

  it('should throw a `TypeError` with correct message if `value` not of type `number`', () => {
    assertThrows(
      () => _number(undefined, 'name'),
      TypeError,
      errorMessage(undefined, 'number', 'name'),
    );

    assertThrows(
      () => _number(undefined),
      TypeError,
      errorMessage(undefined, 'number'),
    );
    assertThrows(
      () => _number(null),
      TypeError,
      errorMessage(null, 'number'),
    );
    assertThrows(
      () => _number(false),
      TypeError,
      errorMessage(false, 'number'),
    );
    assertThrows(() => _number(''), TypeError, errorMessage('', 'number'));
    assertThrows(() => _number([]), TypeError, errorMessage([], 'number'));
    assertThrows(() => _number({}), TypeError, errorMessage({}, 'number'));
  });
});
