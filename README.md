# Type Guard Kit

[![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/antonebbage/typeguardkit/branch/main/graph/badge.svg?token=SL3A2OQ4W6)](https://codecov.io/gh/antonebbage/typeguardkit)

A TypeScript module to help create a type and its guards from a single source
definition.

The module can be used to type APIs and catch unexpected incompatible types due
to interface definitions being outdated without versioning protection from
breaking changes, interfaces not being adhered to, or data being corrupted.

## Setup

### Deno module URL

```
https://deno.land/x/typeguardkit/mod.ts
```

## Usage

### Example

```ts
import {
  _boolean,
  _number,
  _string,
  arrayOf,
  Asserter,
  objectAsserter,
  undefinedOr,
  unionOf,
} from "./mod.ts";

// entity_types/book.ts

const asserter = objectAsserter("Book", {
  title: _string,
  authors: arrayOf(_string),
  pageCount: _number,
  isRecommended: _boolean,
  websiteUrl: undefinedOr(_string),
});

export interface Book extends ReturnType<typeof asserter> {}

export const _Book: Asserter<Book> = asserter;

// api/get_book.ts

export async function getBook(id: string): Promise<Book> {
  const response = await fetch(`/api/books/${id}`);
  const responseBody = await response.json();

  // If `responseBody` is a `Book`, `_Book` returns `responseBody` as `Book`.
  // Otherwise, `_Book` throws a `TypeAssertionError`, including
  // `"responseBody"` in its `message`.

  return _Book(responseBody, "responseBody");
}
```

### `Asserter`s

An `Asserter` is a type assertion function.

```ts
interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}
```

If `value` is of `Type`, the `Asserter` should return `value` as `Type`.
Otherwise, the `Asserter` should throw a `TypeAssertionError`.

The module includes the `_boolean`, `_number`, and `_string` `Asserter`s.

You can use an `Asserter` like this:

```ts
import { _string } from "./mod.ts";

function handleUnknown(x: unknown) {
  let y;

  try {
    y = _string(x, "x");
  } catch {
    return;
  }

  // `y` has now been initialized and inferred to be of type `string`, so can be
  // passed to `handleString`. `x` is still of `unknown` type though, so cannot.

  handleString(y);
}

function handleString(y: string) {}
```

You can create your own `Asserter` with the `type` function. For example, the
`_string` `Asserter` was created like this:

```ts
import { type } from "./mod.ts";

export const _string = type(
  "string",
  (value): value is string => typeof value === "string",
);
```

Prefixing `Asserter` names with an underscore `_` helps to avoid name conflicts
and shadowing.

### Assertion signature wrapper

The `assertIs` function wraps an `Asserter<Type>` with an assertion signature so
the value passed in can be narrowed to `Type`. If the `Asserter` throws an
error, it will bubble up. Otherwise, `assertIs` will not return a value, but
after calling it, the value passed in will be narrowed to `Type`.

You can use `assertIs` like this:

```ts
import { _string, assertIs } from "./mod.ts";

function handleUnknown(x: unknown) {
  try {
    assertIs(_string, x, "x");
  } catch {
    return;
  }

  // `x` has now been narrowed to type `string`, so can be passed to
  // `handleString`.

  handleString(x);
}

function handleString(x: string) {}
```

### Predicate signature wrapper

The `is` function wraps an `Asserter<Type>` with a predicate signature, creating
a type guard, so the value passed in can be narrowed to `Type`. If the
`Asserter` throws an error, `is` will catch it and return `false`. Otherwise,
`is` will return `true`.

You can use `is` like this:

```ts
import { _string, is } from "./mod.ts";

function handleUnknown(x: unknown) {
  if (is(_string, x)) {
    // `x` has now been narrowed to type `string`, so can be passed to
    // `handleString`.

    handleString(x);
  }
}

function handleString(x: string) {}
```

### Other `Asserter` factory functions

The following functions help to create new `Asserter`s from existing ones.

#### `unionOf`

The `unionOf` function returns an `Asserter` for the union of the provided
`Asserter`s' `Type`s.

You can use `unionOf` like this:

```ts
import { _number, _string, is, unionOf } from "./mod.ts";

const _stringOrNumber = unionOf(_string, _number);

function handleUnknown(x: unknown) {
  if (is(_stringOrNumber, x)) {
    // `x` has now been narrowed to type `string | number`, so can be passed
    // to `handleStringOrNumber`.

    handleStringOrNumber(x);
  }
}

function handleStringOrNumber(x: string | number) {}
```

#### `arrayOf`

The `arrayOf` function returns an `Asserter<Array<Type>>`, created using the
provided `Asserter<Type>`.

You can use `arrayOf` like this:

```ts
import { _string, arrayOf, is } from "./mod.ts";

const _arrayOfString = arrayOf(_string);

function handleUnknown(x: unknown) {
  if (is(_arrayOfString, x)) {
    // `x` has now been narrowed to type `Array<string>`, so can be passed to
    // `handleArrayOfString`.

    handleArrayOfString(x);
  }
}

function handleArrayOfString(x: string[]) {}
```

#### `undefinedOr`

The `undefinedOr` function returns an `Asserter<Type | undefined>`, created
using the provided `Asserter<Type>`.

You can use `undefinedOr` like this:

```ts
import { _string, is, undefinedOr } from "./mod.ts";

const _stringOrUndefined = undefinedOr(_string);

function handleUnknown(x: unknown) {
  if (is(_stringOrUndefined, x)) {
    // `x` has now been narrowed to type `string | undefined`, so can be passed
    // to `handleStringOrUndefined`.

    handleStringOrUndefined(x);
  }
}

function handleStringOrUndefined(x?: string) {}
```

#### `nullOr`

The `nullOr` function returns an `Asserter<Type | null>`, created using the
provided `Asserter<Type>`.

You can use `nullOr` like this:

```ts
import { _string, is, nullOr } from "./mod.ts";

const _stringOrNull = nullOr(_string);

function handleUnknown(x: unknown) {
  if (is(_stringOrNull, x)) {
    // `x` has now been narrowed to type `string | null`, so can be passed to
    // `handleStringOrNull`.

    handleStringOrNull(x);
  }
}

function handleStringOrNull(x: string | null) {}
```

### `ObjectAsserter`s

An `ObjectAsserter` is an `Asserter` for the object type defined by its
`propertyAsserters`.

```ts
import { Asserter } from "./mod.ts";

interface ObjectAsserter<Type extends Record<string, unknown>>
  extends Asserter<Type> {
  readonly propertyAsserters: Readonly<
    { [Key in keyof Type]: Asserter<Type[Key]> }
  >;
}
```

You can create an `ObjectAsserter` with the `objectAsserter` function and use it
like this:

```ts
import { _number, _string, Asserter, is, objectAsserter } from "./mod.ts";

const asserter = objectAsserter("User", {
  name: _string,
  age: _number,
});

export interface User extends ReturnType<typeof asserter> {}

export const _User: Asserter<User> = asserter;

function handleUnknown(x: unknown) {
  if (is(_User, x)) {
    // `x` has now been narrowed to type `User`, so can be passed to
    // `handleUser`.

    handleUser(x);
  }
}

function handleUser(x: User) {}
```
