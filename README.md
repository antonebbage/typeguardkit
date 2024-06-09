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

### Example `import`s

Where you see relative `import` paths in documentation examples, instead
`import` `from "https://deno.land/x/typeguardkit/mod.ts"` if using Deno, or
`from "typeguardkit"` if using npm.

### Example

```ts
import {
  _boolean,
  _null,
  _number,
  _PositiveInteger,
  _string,
  array,
  ObjectAsserter,
  union,
} from "./mod.ts";

// types/book.ts

export const _Book = new ObjectAsserter("Book", {
  isbn: _string,
  title: _string,
  authors: array(_string),
  pageCount: _PositiveInteger,
  rating: union(_number, _null),
  recommended: _boolean,
});

export type Book = ReturnType<typeof _Book.assert>;

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

An `Asserter<Type>` has a type assertion method, `assert`, that asserts whether
the provided `value` is of `Type`.

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
`Asserter`s that perform additional validation.

The `_null` and `_undefined` `Asserter`s can be used to create union type
`Asserter`s with the [`union`](#union) function.

As well as wrapping `Asserter`s in the
[`assertIs`](#assertion-signature-wrapper) or
[`is`](#predicate-signature-wrapper) functions, you can use them like this:

```ts
import { _string } from "./mod.ts";

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
import { TypeAsserter } from "./mod.ts";

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
import { _string, assertIs } from "./mod.ts";

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

### `NumberAsserter`

A `NumberAsserter` is an `Asserter<number>`, with any additional validation
defined by its `NumberAsserterOptions` properties.

The provided `NumberAsserterOptions` are made accessible as properties of the
created `NumberAsserter`.

Example:

```ts
import { NumberAsserter } from "./mod.ts";

export const _EvenNumberInRange = new NumberAsserter("EvenNumberInRange", {
  min: { value: 0, inclusive: true },
  max: { value: 100, inclusive: true },
  step: 2,
});

export type EvenNumberInRange = ReturnType<typeof _EvenNumberInRange.assert>;
```

### `StringAsserter`

A `StringAsserter` is an `Asserter<string>`, with any additional validation
defined by its `StringAsserterOptions` properties.

The provided `StringAsserterOptions` are made accessible as properties of the
created `StringAsserter`.

Example:

```ts
import { StringAsserter } from "./mod.ts";

export const _NonEmptyString = new StringAsserter("NonEmptyString", {
  minLength: 1,
});

export type NonEmptyString = ReturnType<typeof _NonEmptyString.assert>;

export const _NumericString = new StringAsserter("NumericString", {
  regex: { pattern: "\\d+", requirements: ["must be numeric"] },
});

export type NumericString = ReturnType<typeof _NumericString.assert>;

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

export type Palindrome = ReturnType<typeof _Palindrome.assert>;
```

### `LiteralUnionAsserter`

A `LiteralUnionAsserter` is an `Asserter` for the union of its `values`.

The provided `values` are made accessible as a property of the created
`LiteralUnionAsserter`.

Example:

```ts
import { LiteralUnionAsserter } from "./mod.ts";

export const _Direction = new LiteralUnionAsserter(
  "Direction",
  ["up", "right", "down", "left"],
);

export type Direction = ReturnType<typeof _Direction.assert>;
```

### `EnumAsserter`

An `EnumAsserter` is an `Asserter` for the union of the member types of the
provided `enumObject`.

The provided `enumObject` is made accessible as a property of the created
`EnumAsserter`.

Example:

```ts
import { EnumAsserter } from "./mod.ts";

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
import { _null, _string, UnionAsserter } from "./mod.ts";

export const _stringOrNull = new UnionAsserter(
  "stringOrNull",
  [_string, _null],
);

export type stringOrNull = ReturnType<typeof _stringOrNull.assert>;
```

#### `union`

The `union` function can be used to create a `UnionAsserter` without specifying
a `typeName`.

Example:

```ts
import { _null, _string, union } from "./mod.ts";

export const _stringOrNull = union(_string, _null);

export type stringOrNull = ReturnType<typeof _stringOrNull.assert>;
```

### `ArrayAsserter`

An `ArrayAsserter` is an `Asserter` for the `Array` type defined by its
`elementAsserter`, with any additional validation defined by its
`ArrayAsserterOptions` properties.

The provided `memberAsserter` and `ArrayAsserterOptions` are made accessible as
properties of the created `ArrayAsserter`.

Example:

```ts
import { _string, ArrayAsserter } from "./mod.ts";

export const _NonEmptyArrayOfString = new ArrayAsserter(
  "NonEmptyArrayOfString",
  _string,
  { minLength: 1 },
);

export type NonEmptyArrayOfString = ReturnType<
  typeof _NonEmptyArrayOfString.assert
>;
```

#### `array`

The `array` function can be used to create an `ArrayAsserter` without specifying
a `typeName` or `ArrayAsserterOptions`.

Example:

```ts
import { _string, array } from "./mod.ts";

export const _ArrayOfString = array(_string);

export type ArrayOfString = ReturnType<typeof _ArrayOfString.assert>;
```

### `RecordAsserter`

A `RecordAsserter` is an `Asserter` for the `Record` type defined by its
`keyAsserter` and `valueAsserter`.

The provided `keyAsserter` and `valueAsserter` are made accessible as properties
of the created `RecordAsserter`.

Example:

```ts
import { _string, RecordAsserter } from "./mod.ts";

export const _RecordOfStringByString = new RecordAsserter(
  "RecordOfStringByString",
  [_string, _string],
);

export type RecordOfStringByString = ReturnType<
  typeof _RecordOfStringByString.assert
>;
```

#### `record`

The `record` function can be used to create a `RecordAsserter` without
specifying a `typeName`.

Example:

```ts
import { _string, record } from "./mod.ts";

export const _RecordOfStringByString = record(_string, _string);

export type RecordOfStringByString = ReturnType<
  typeof _RecordOfStringByString.assert
>;
```

### `ObjectAsserter`

An `ObjectAsserter` is an `Asserter` for the object type defined by its
`propertyAsserters`.

The provided `propertyAsserters` are made accessible as a property of the
created `ObjectAsserter`.

Example:

```ts
import { _string, ObjectAsserter, option } from "./mod.ts";

export const _User = new ObjectAsserter("User", {
  name: _string,
  emailAddress: option(_string),
});

export type User = ReturnType<typeof _User.assert>;
```

### `ObjectIntersectionAsserter`

An `ObjectIntersectionAsserter` is an `ObjectAsserter` for the intersection of
the asserted types of the provided `ObjectAsserter`s.

Example:

```ts
import { _string, ObjectAsserter, ObjectIntersectionAsserter } from "./mod.ts";

// types/entity.ts

export const _Entity = new ObjectAsserter("Entity", {
  id: _string,
});

export type Entity = ReturnType<typeof _Entity.assert>;

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

export type User = ReturnType<typeof _User.assert>;
```

#### `objectIntersection`

The `objectIntersection` function can be used to create an
`ObjectIntersectionAsserter` without specifying a `typeName`.

Example:

```ts
import { _string, ObjectAsserter, objectIntersection } from "./mod.ts";

// types/a.ts

export const _A = new ObjectAsserter("A", {
  a: _string,
});

export type A = ReturnType<typeof _A.assert>;

// types/b.ts

export const _B = new ObjectAsserter("B", {
  b: _string,
});

export type B = ReturnType<typeof _B.assert>;

// types/c.ts

export const _C = objectIntersection(_A, _B);

export type C = ReturnType<typeof _C.assert>;
```

### `PartialAsserter`

A `PartialAsserter` is an `ObjectAsserter` for the asserted type of the provided
`ObjectAsserter` with all properties set to optional.

Example:

```ts
import { _string, ObjectAsserter, PartialAsserter } from "./mod.ts";

export const _Options = new PartialAsserter(
  "Options",
  {
    option1: _string,
    option2: _string,
    option3: _string,
  },
);

export type Options = ReturnType<typeof _Options.assert>;
```

#### `partial`

The `partial` function can be used to create a `PartialAsserter` without
specifying a `typeName`.

Example:

```ts
import { _string, ObjectAsserter, partial } from "./mod.ts";

// types/user_name.ts

export const _UserName = new ObjectAsserter("UserName", {
  firstName: _string,
  lastName: _string,
});

export type UserName = ReturnType<typeof _UserName.assert>;

// types/user_name_update.ts

export const _UserNameUpdate = partial(_UserName);

export type UserNameUpdate = ReturnType<typeof _UserNameUpdate.assert>;
```

### `PickAsserter`

A `PickAsserter` is an `ObjectAsserter` for the type constructed by picking the
set of properties `Keys` from the asserted type of the provided
`ObjectAsserter`.

Example:

```ts
import { _string, ObjectAsserter, PickAsserter } from "./mod.ts";

// types/user.ts

export const _User = new ObjectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = ReturnType<typeof _User.assert>;

// types/user_name.ts

export const _UserName = new PickAsserter(
  "UserName",
  _User,
  ["firstName", "lastName"],
);

export type UserName = ReturnType<typeof _UserName.assert>;
```

#### `pick`

The `pick` function can be used to create a `PickAsserter` without specifying a
`typeName`.

Example:

```ts
import { _string, ObjectAsserter, pick } from "./mod.ts";

// types/user.ts

export const _User = new ObjectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = ReturnType<typeof _User.assert>;

// types/user_name.ts

export const _UserName = pick(_User, ["firstName", "lastName"]);

export type UserName = ReturnType<typeof _UserName.assert>;
```

### The `TypeAssertionError` issue tree

A `TypeAssertionError` has an `issueTree` property of type
`TypeAssertionIssueTree`, which provides a tree representation of the issue data
contained in the error's `message`.

`TypeAssertionIssueTree` is an alias of `TypeAssertionIssueTreeNode` for typing
the root `TypeAssertionIssueTreeNode`.

A `TypeAssertionError` also has an `issueTreeNode` method to find the node at a
given `path`. The `path` separator is a forward slash, and a `path` segment can
be an object property name or array index.

`issueTreeNode` could be called to get the issue data for each field in a form,
for example:

```ts
import {
  _NonNegativeInteger,
  _string,
  assertIs,
  is,
  ObjectAsserter,
  TypeAssertionError,
} from "./mod.ts";

// types/item.ts

export const _Item = new ObjectAsserter("Item", {
  quantity: _NonNegativeInteger,
});

export type Item = ReturnType<typeof _Item.assert>;

// types/form.ts

export const _Form = new ObjectAsserter("Form", {
  item: _Item,
});

export type Form = ReturnType<typeof _Form.assert>;

// elsewhere.ts

const form: Form = {
  item: {
    quantity: 0,
  },
};

let itemQuantityIssues: string[] = [];

function validateForm(): boolean {
  try {
    assertIs(_Form, form);
  } catch (error) {
    if (error instanceof TypeAssertionError) {
      const node = error.issueTreeNode("item/quantity");

      itemQuantityIssues = node?.issues
        ? node.issues.filter((issue) => is(_string, issue)) as string[]
        : [];
    }

    return false;
  }

  return true;
}
```

### Sending `TypeAssertionError`s to another program

A `TypeAssertionError`'s `toJSON` method returns a JSON representation of the
error's `issueTree`, which can then be sent to another program and used to
create a new `TypeAssertionError` there with the same `issueTree`.

In the receiving program, you can assert that a received object is a
`TypeAssertionIssueTree` using the `_TypeAssertionIssueTree` `Asserter`. You can
then create a `TypeAssertionError` by passing the asserted
`TypeAssertionIssueTree` to its constructor.
