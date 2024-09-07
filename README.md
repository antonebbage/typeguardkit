# TypeGuardKit

[![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg?event=push)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/antonebbage/typeguardkit/branch/main/graph/badge.svg?token=SL3A2OQ4W6)](https://codecov.io/gh/antonebbage/typeguardkit)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/typeguardkit/mod.ts)

**⚠️ API not yet stable**

A TypeScript module to help construct type assertion functions and type guards.

The included classes and functions can be used to create types and their
assertion functions and guards from a single source definition.

Type assertion functions and guards can be used to catch incompatible types
entering your program due to data corruption, interfaces not being adhered to,
or interface definitions being outdated without versioning protection from
breaking changes.

## Setup

### Deno module URL

```
https://deno.land/x/typeguardkit/mod.ts
```

### npm installation

```sh
npm install typeguardkit
```

## Usage

### Example

```ts
import {
  _boolean,
  _null,
  _number,
  _PositiveInteger,
  _string,
  array,
  Asserted,
  ObjectAsserter,
  union,
} from "typeguardkit";

// types/book.ts

export const _Book = new ObjectAsserter("Book", {
  isbn: _string,
  title: _string,
  authors: array(_string),
  pageCount: _PositiveInteger,
  rating: union(_number, _null),
  recommended: _boolean,
});

export type Book = Asserted<typeof _Book>;

// api/get_book.ts

export async function getBook(isbn: string): Promise<Book> {
  const response = await fetch(`/api/books/${isbn}`);

  const responseBody = await response.json();

  // If `responseBody` is a `Book`, `_Book.assert` returns `responseBody` as
  // `Book`. Otherwise, `_Book` throws a `TypeAssertionError`, including the
  // optional value name `"responseBody"` in its `message`.

  return _Book.assert(responseBody, "responseBody");
}
```

### `Asserter`

An `Asserter<Type>` has a type assertion method, `assert`, which should assert
whether the provided `value` is of `Type`.

```ts
interface Asserter<Type> {
  readonly typeName: string;

  assert(value: unknown, valueName?: string): Type;
}
```

If `value` is of `Type`, `assert` should return `value` as `Type`. Otherwise,
`assert` should throw a `TypeAssertionError`, including `valueName` in its
`message`.

The module includes the `_boolean`, `_number`, `_string`, `_null`, and
`_undefined` primitive type `Asserter`s.

It also includes the `_NonNegativeNumber`, `_PositiveNumber`, `_Integer`,
`_NonNegativeInteger`, and `_PositiveInteger` `Asserter`s, which are `number`
`Asserter`s that have additional, runtime-only constraints.

The `_null` and `_undefined` `Asserter`s can be used to create union type
`Asserter`s with the [`union`](#union) function.

As well as wrapping `Asserter`s in the
[`assertIs`](#assertion-signature-wrapper) or
[`is`](#predicate-signature-wrapper) functions, you can use them like this:

```ts
import { _string } from "typeguardkit";

function handleUnknown(x: unknown) {
  let y;

  try {
    y = _string.assert(x, "x");
  } catch {
    return;
  }

  // `y` has now been initialized and inferred to be of type `string`, so can be
  // passed to `handleString`. `x` is still of `unknown` type though, so cannot.

  handleString(y);
}

function handleString(y: string) {}
```

You can create your own `Asserter`s using the `TypeAsserter` class. For example,
the `_string` `Asserter` was created like this:

```ts
import { TypeAsserter } from "typeguardkit";

export const _string = new TypeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);
```

Prefixing `Asserter` names with an underscore `_` helps to avoid name conflicts
and shadowing.

### Assertion signature wrapper

The `assertIs` function wraps an `Asserter<Type>` with an
[assertion signature](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
so the value passed in can be narrowed to `Type`. If the `Asserter` throws an
error, it will bubble up. Otherwise, `assertIs` will not return a value, but
after calling it, the value passed in will be narrowed to `Type`.

Example:

```ts
import { _string, assertIs } from "typeguardkit";

function handleUnknown(x: unknown) {
  assertIs(_string, x, "x");

  // `x` has now been narrowed to type `string`, so can be passed to
  // `handleString`.

  handleString(x);
}

function handleString(x: string) {}
```

### Predicate signature wrapper

The `is` function wraps an `Asserter<Type>` with a
[predicate signature](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates),
creating a type guard, so the value passed in can be narrowed to `Type`. If the
`Asserter` throws an error, `is` will catch it and return `false`. Otherwise,
`is` will return `true`.

Example:

```ts
import { _string, is } from "typeguardkit";

function handleUnknown(x: unknown) {
  if (is(_string, x)) {
    // `x` has now been narrowed to type `string`, so can be passed to
    // `handleString`.

    handleString(x);
  }
}

function handleString(x: string) {}
```

### `NumberAsserter`

A `NumberAsserter` is an `Asserter<number>`, with any additional constraints
defined by its `NumberAsserterOptions` properties.

The provided `NumberAsserterOptions` are made accessible as properties of the
created `NumberAsserter`.

A `NumberAsserter` is also a `Validator<number>` with a `validate` method, which
checks only that the provided `value` meets any constraints defined in the
`NumberAsserterOptions`, and returns any issues. This can be used to validate
user input client side, where it should already be known that `value` is a
`number`.

Example:

```ts
import { Asserted, NumberAsserter } from "typeguardkit";

export const _EvenNumberInRange = new NumberAsserter("EvenNumberInRange", {
  min: { value: 0, inclusive: true },
  max: { value: 100, inclusive: true },
  step: 2,
});

export type EvenNumberInRange = Asserted<typeof _EvenNumberInRange>;
```

### `StringAsserter`

A `StringAsserter` is an `Asserter<string>`, with any additional constraints
defined by its `StringAsserterOptions` properties.

The provided `StringAsserterOptions` are made accessible as properties of the
created `StringAsserter`.

A `StringAsserter` is also a `Validator<string>` with a `validate` method, which
checks only that the provided `value` meets any constraints defined in the
`StringAsserterOptions`, and returns any issues. This can be used to validate
user input client side, where it should already be known that `value` is a
`string`.

Example:

```ts
import { Asserted, StringAsserter } from "typeguardkit";

export const _NonEmptyString = new StringAsserter("NonEmptyString", {
  minLength: 1,
});

export type NonEmptyString = Asserted<typeof _NonEmptyString>;

export const _NumericString = new StringAsserter("NumericString", {
  regex: { pattern: "\\d+", requirements: ["must be numeric"] },
});

export type NumericString = Asserted<typeof _NumericString>;

export const _Palindrome = new StringAsserter("Palindrome", {
  rules: [
    {
      validate(value) {
        if (value.length < 2) {
          return true;
        }

        const forwardValue = value.replace(/[^0-9a-z]/gi, "");
        const backwardValue = forwardValue.split("").reverse().join("");

        return forwardValue === backwardValue;
      },

      requirements: ["must be a palindrome"],
    },
  ],
});

export type Palindrome = Asserted<typeof _Palindrome>;
```

### `LiteralUnionAsserter`

A `LiteralUnionAsserter` is an `Asserter` for the union of its `values`.

The provided `values` are made accessible as a property of the created
`LiteralUnionAsserter`.

Example:

```ts
import { Asserted, LiteralUnionAsserter } from "typeguardkit";

export const _Direction = new LiteralUnionAsserter(
  "Direction",
  ["up", "right", "down", "left"],
);

export type Direction = Asserted<typeof _Direction>;
```

### `EnumAsserter`

An `EnumAsserter` is an `Asserter` for the union of the member types of the
provided `enumObject`.

The provided `enumObject` is made accessible as a property of the created
`EnumAsserter`.

Example:

```ts
import { EnumAsserter } from "typeguardkit";

export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export const _Direction = new EnumAsserter("Direction", Direction);
```

### `UnionAsserter`

A `UnionAsserter` is an `Asserter` for the union of the `Type`s of its
`memberAsserters`.

The provided `memberAsserters` are made accessible as a property of the created
`UnionAsserter`.

Example:

```ts
import { _null, _string, Asserted, UnionAsserter } from "typeguardkit";

export const _stringOrNull = new UnionAsserter(
  "stringOrNull",
  [_string, _null],
);

export type stringOrNull = Asserted<typeof _stringOrNull>;
```

#### `union`

The `union` function can be used to create a `UnionAsserter` without specifying
a `typeName`.

Example:

```ts
import { _null, _string, Asserted, union } from "typeguardkit";

export const _stringOrNull = union(_string, _null);

export type stringOrNull = Asserted<typeof _stringOrNull>;
```

### `ArrayAsserter`

An `ArrayAsserter` is an `Asserter` for the `Array` type defined by its
`elementAsserter`, with any additional constraints defined by its
`ArrayAsserterOptions` properties.

The provided `memberAsserter` and `ArrayAsserterOptions` are made accessible as
properties of the created `ArrayAsserter`.

An `ArrayAsserter` is also a `Validator` with a `validate` method, which checks
only that the provided `value` meets any constraints defined in the
`ArrayAsserterOptions`, and returns any issues. This can be used to validate
user input client side, where it should already be known that `value` meets the
compile-time constraints of the array type.

Example:

```ts
import { _number, _string, ArrayAsserter, Asserted } from "typeguardkit";

export const _NonEmptyArrayOfString = new ArrayAsserter(
  "NonEmptyArrayOfString",
  _string,
  { minLength: 1 },
);

export type NonEmptyArrayOfString = Asserted<typeof _NonEmptyArrayOfString>;

export const _ArraySetOfString = new ArrayAsserter(
  "ArraySetOfString",
  _string,
  { mustBeASet: true },
);

export type ArraySetOfString = Asserted<typeof _ArraySetOfString>;

export const _AscendingArrayOfNumber = new ArrayAsserter(
  "AscendingArrayOfNumber",
  _number,
  {
    rules: [
      {
        validate(value) {
          for (let i = 1; i < value.length; i++) {
            if (value[i - 1] > value[i]) {
              return false;
            }
          }

          return true;
        },

        requirements: ["must be in ascending order"],
      },
    ],
  },
);

export type AscendingArrayOfNumber = Asserted<typeof _AscendingArrayOfNumber>;
```

#### `array`

The `array` function can be used to create an `ArrayAsserter` without specifying
a `typeName` or `ArrayAsserterOptions`.

Example:

```ts
import { _string, array, Asserted } from "typeguardkit";

export const _ArrayOfString = array(_string);

export type ArrayOfString = Asserted<typeof _ArrayOfString>;
```

### `RecordAsserter`

A `RecordAsserter` is an `Asserter` for the `Record` type defined by its
`keyAsserter` and `valueAsserter`.

The provided `keyAsserter` and `valueAsserter` are made accessible as properties
of the created `RecordAsserter`.

Example:

```ts
import { _string, Asserted, RecordAsserter } from "typeguardkit";

export const _RecordOfStringByString = new RecordAsserter(
  "RecordOfStringByString",
  [_string, _string],
);

export type RecordOfStringByString = Asserted<typeof _RecordOfStringByString>;
```

#### `record`

The `record` function can be used to create a `RecordAsserter` without
specifying a `typeName`.

Example:

```ts
import { _string, Asserted, record } from "typeguardkit";

export const _RecordOfStringByString = record(_string, _string);

export type RecordOfStringByString = Asserted<typeof _RecordOfStringByString>;
```

### `ObjectAsserter`

An `ObjectAsserter` is an `Asserter` for the object type defined by its
`propertyAsserters`.

The provided `propertyAsserters` are made accessible as a property of the
created `ObjectAsserter`.

Example:

```ts
import { _string, Asserted, ObjectAsserter, option } from "typeguardkit";

export const _User = new ObjectAsserter("User", {
  name: _string,
  emailAddress: option(_string),
});

export type User = Asserted<typeof _User>;
```

### `ObjectIntersectionAsserter`

An `ObjectIntersectionAsserter` is an `ObjectAsserter` for the intersection of
the asserted types of the provided `ObjectAsserter`s.

Example:

```ts
import {
  _string,
  Asserted,
  ObjectAsserter,
  ObjectIntersectionAsserter,
} from "typeguardkit";

// types/entity.ts

export const _Entity = new ObjectAsserter("Entity", {
  id: _string,
});

export type Entity = Asserted<typeof _Entity>;

// types/user.ts

export const _User = new ObjectIntersectionAsserter(
  "User",
  [
    _Entity,

    {
      name: _string,
    },
  ],
);

export type User = Asserted<typeof _User>;
```

#### `objectIntersection`

The `objectIntersection` function can be used to create an
`ObjectIntersectionAsserter` without specifying a `typeName`.

Example:

```ts
import {
  _string,
  Asserted,
  ObjectAsserter,
  objectIntersection,
} from "typeguardkit";

// types/a.ts

export const _A = new ObjectAsserter("A", {
  a: _string,
});

export type A = Asserted<typeof _A>;

// types/b.ts

export const _B = new ObjectAsserter("B", {
  b: _string,
});

export type B = Asserted<typeof _B>;

// types/c.ts

export const _C = objectIntersection(_A, _B);

export type C = Asserted<typeof _C>;
```

### `PartialAsserter`

A `PartialAsserter` is an `ObjectAsserter` for the asserted type of the provided
`ObjectAsserter` with all properties set to optional.

Example:

```ts
import {
  _string,
  Asserted,
  ObjectAsserter,
  PartialAsserter,
} from "typeguardkit";

export const _Options = new PartialAsserter(
  "Options",
  {
    option1: _string,
    option2: _string,
    option3: _string,
  },
);

export type Options = Asserted<typeof _Options>;
```

#### `partial`

The `partial` function can be used to create a `PartialAsserter` without
specifying a `typeName`.

Example:

```ts
import { _string, Asserted, ObjectAsserter, partial } from "typeguardkit";

// types/user_name.ts

export const _UserName = new ObjectAsserter("UserName", {
  firstName: _string,
  lastName: _string,
});

export type UserName = Asserted<typeof _UserName>;

// types/user_name_update.ts

export const _UserNameUpdate = partial(_UserName);

export type UserNameUpdate = Asserted<typeof _UserNameUpdate>;
```

### `PickAsserter`

A `PickAsserter` is an `ObjectAsserter` for the type constructed by picking the
set of properties `Keys` from the asserted type of the provided
`ObjectAsserter`.

Example:

```ts
import { _string, Asserted, ObjectAsserter, PickAsserter } from "typeguardkit";

// types/user.ts

export const _User = new ObjectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = Asserted<typeof _User>;

// types/user_name.ts

export const _UserName = new PickAsserter(
  "UserName",
  _User,
  ["firstName", "lastName"],
);

export type UserName = Asserted<typeof _UserName>;
```

#### `pick`

The `pick` function can be used to create a `PickAsserter` without specifying a
`typeName`.

Example:

```ts
import { _string, Asserted, ObjectAsserter, pick } from "typeguardkit";

// types/user.ts

export const _User = new ObjectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = Asserted<typeof _User>;

// types/user_name.ts

export const _UserName = pick(_User, ["firstName", "lastName"]);

export type UserName = Asserted<typeof _UserName>;
```

### `Validator`

A `Validator<Type>` has a `validate` method, which should check `value` meets
any runtime-only constraints of `Type`, and return any issues. This should not
include constraints of any `Validator`s for properties or elements of `Type`.

```ts
interface Validator<Type> {
  validate(value: Type): string[];
}
```

Any `Asserter<Type>` class that allows runtime-only constraints should also
implement `Validator<Type>`.

`validate` can then be used to validate user input client side, where it should
already be known that `value` meets the compile-time constraints of `Type`.
