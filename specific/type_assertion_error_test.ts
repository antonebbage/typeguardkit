import {
  assertStrictEquals,
  assertStringIncludes,
  describe,
  it,
} from '/dev_deps.ts';
import { _number, _string } from './asserters.ts';
import { TypeAssertionError } from './type_assertion_error.ts';

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
