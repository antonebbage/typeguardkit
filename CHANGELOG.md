## [0.14.0](https://github.com/antonebbage/typeguardkit/compare/0.13.0...0.14.0) (2023-03-25)

### Features

- add `stringAsserter` function
  ([448c5f2](https://github.com/antonebbage/typeguardkit/commit/448c5f2ba1635f791ce4eb9a71a507f1453fbce6))
- return `UnionAsserter` from `unionOf`
  ([c4e8cce](https://github.com/antonebbage/typeguardkit/commit/c4e8cce3ed166f376a3b88d9859f681c59c73981))

## [0.13.0](https://github.com/antonebbage/typeguardkit/compare/0.12.0...0.13.0) (2023-02-11)

### ⚠ BREAKING CHANGES

- rename `Asserter.typeName` to `assertedTypeName`

### Features

- add `Asserter.asserterTypeName`
  ([0b4f33e](https://github.com/antonebbage/typeguardkit/commit/0b4f33ea1eab1d5ff3fa0333151adee78598acdf))
- make `TypeAssertionError` extend `TypeError`
  ([bc9fd08](https://github.com/antonebbage/typeguardkit/commit/bc9fd08ab01bf6564d7f53a8e2904bcb976de57b))
- rename `Asserter.typeName` to `assertedTypeName`
  ([89224a1](https://github.com/antonebbage/typeguardkit/commit/89224a1ba84fde2d78cf10900dc1fed31a5b3de7))

## [0.12.0](https://github.com/antonebbage/typeguardkit/compare/0.11.0...0.12.0) (2023-02-04)

### Features

- add `recordOf` function
  ([d88f6f2](https://github.com/antonebbage/typeguardkit/commit/d88f6f2c2145699c98d5c9d803ba62836d1742a7))

## [0.11.0](https://github.com/antonebbage/typeguardkit/compare/0.10.1...0.11.0) (2022-12-17)

### ⚠ BREAKING CHANGES

- make `NumberAsserter` readonly

### Features

- add `_NonNegativeNumber` `Asserter`
  ([9786aa8](https://github.com/antonebbage/typeguardkit/commit/9786aa8294ba691dd88370cab98c7e98686955f1))
- add `_PositiveNumber` `Asserter`
  ([733c15a](https://github.com/antonebbage/typeguardkit/commit/733c15aa4fe54fc4688075ca44fcc164307dbdc5))
- make `NumberAsserter` readonly
  ([3e2d71b](https://github.com/antonebbage/typeguardkit/commit/3e2d71bd663999916ac7321a5fb3549961309577))
- return `LiteralUnionAsserter` from `literalUnionAsserter`
  ([ea81b9c](https://github.com/antonebbage/typeguardkit/commit/ea81b9c88d391dc19b738a0dbb4d6250e03836c1))

## [0.10.1](https://github.com/antonebbage/typeguardkit/compare/0.10.0...0.10.1) (2022-12-05)

### Bug Fixes

- use `NumberAsserter.min.value` as stepping base
  ([13f83de](https://github.com/antonebbage/typeguardkit/commit/13f83de4cd0432b2300257e25ff9c3fc512597b1))

## [0.10.0](https://github.com/antonebbage/typeguardkit/compare/0.9.0...0.10.0) (2022-12-04)

### ⚠ BREAKING CHANGES

- `NumberAsserterSubtype` has been removed, along with
  `NumberAsserterOptions.subtype`. `NumberAsserterOptions.disallowNaN` has been
  added back to use instead of setting `subtype` to `"valid"`, but the default
  value of `false` now means `NaN` is valid regardless of any other constraints.
  `step` can be set to `1` instead of setting `subtype` to `"integer"`.

### Features

- add `_Integer` `Asserter`
  ([13ddb76](https://github.com/antonebbage/typeguardkit/commit/13ddb76e0661296ed32c13f2a48315e2d7940b74))
- add `_NonNegativeInteger` `Asserter`
  ([b02f119](https://github.com/antonebbage/typeguardkit/commit/b02f119cbfaeaeada744ad53ac50f851e1a858c3))
- add `_PositiveInteger` `Asserter`
  ([77da461](https://github.com/antonebbage/typeguardkit/commit/77da461a5b627ae55cdd5dfd0ab6d5dbf1fd7e1f))
- add `step` to `NumberAsserterOptions`
  ([4bddd24](https://github.com/antonebbage/typeguardkit/commit/4bddd2442b7011fe1ea075b4165724fec1ba621d))

## [0.9.0](https://github.com/antonebbage/typeguardkit/compare/0.8.0...0.9.0) (2022-11-26)

### ⚠ BREAKING CHANGES

- modify `NumberAsserterOptions`

### Features

- modify `NumberAsserterOptions`
  ([c5226ea](https://github.com/antonebbage/typeguardkit/commit/c5226ea25e43805d7c331d2f80f839fa21fe725f))
- return `NumberAsserter` from `numberAsserter`
  ([230a3cf](https://github.com/antonebbage/typeguardkit/commit/230a3cfce1fd5ecce517fd4c19ed5dcb12f7307b))

## [0.8.0](https://github.com/antonebbage/typeguardkit/compare/0.7.0...0.8.0) (2022-11-12)

### Features

- add `TypeAssertionError` issue tree
  ([fe59078](https://github.com/antonebbage/typeguardkit/commit/fe59078d659b260bfd42521c3073d78e289cd108))

## [0.7.0](https://github.com/antonebbage/typeguardkit/compare/0.6.0...0.7.0) (2022-10-08)

### Features

- add `numberAsserter` function
  ([4c33f67](https://github.com/antonebbage/typeguardkit/commit/4c33f6730ef22ef7519a29f88ae7a8be341b555e))

### Bug Fixes

- assert `objectIntersectionOf` property asserter type
  ([a3d6e97](https://github.com/antonebbage/typeguardkit/commit/a3d6e97c9a3d7c5cde8da83db1392f02293949a4))

## [0.6.0](https://github.com/antonebbage/typeguardkit/compare/0.5.1...0.6.0) (2022-09-24)

### ⚠ BREAKING CHANGES

- exports from the `/generic` and `/specific` folders have moved to `/core` and
  `/asserters`, respectively, except for the `TypeAssertionError` exports, which
  moved from `/specific` to `/core`.
- `TypeAssertionErrorOptions` is now `readonly` and its `innerError` property
  renamed to `issues`.

### Features

- include all issues in array + object asserter errors
  ([929e663](https://github.com/antonebbage/typeguardkit/commit/929e6634d20f0dd91ea826ef058758a6c355cb5c))

### Code Refactoring

- reorganize code
  ([f1edcf1](https://github.com/antonebbage/typeguardkit/commit/f1edcf1744c34f9693e16212cebf616936512b7c))

## [0.5.1](https://github.com/antonebbage/typeguardkit/compare/0.5.0...0.5.1) (2022-09-03)

### Bug Fixes

- correctly set default `typeAsserter` + `objectAsserter` `typeName`
  ([0e90b0b](https://github.com/antonebbage/typeguardkit/commit/0e90b0b2d183e8d568402ac6b58a3b36a452f4a5))

## [0.5.0](https://github.com/antonebbage/typeguardkit/compare/0.4.0...0.5.0) (2022-07-30)

### Features

- set default `Asserter.typeName` if empty `string` provided
  ([c69a147](https://github.com/antonebbage/typeguardkit/commit/c69a14748b7fce982c633cecd863f752659a8168))

## [0.4.0](https://github.com/antonebbage/typeguardkit/compare/0.3.1...0.4.0) (2022-07-23)

### ⚠ BREAKING CHANGES

- add optional `typeName` parameter to `unionOf`

### Features

- add `partialFrom` function
  ([490cbe9](https://github.com/antonebbage/typeguardkit/commit/490cbe931d35936a50e6720e0e068a97f36f68ed))
- add `pickFrom` function
  ([b6ea6af](https://github.com/antonebbage/typeguardkit/commit/b6ea6af0d8ed964f864d5c061f4b44b5028cb4da))
- add optional `typeName` parameter to `arrayOf`
  ([4a8e150](https://github.com/antonebbage/typeguardkit/commit/4a8e15084ebc81ff8a12388add4bdf82c7bd3c08))
- add optional `typeName` parameter to `unionOf`
  ([92528f0](https://github.com/antonebbage/typeguardkit/commit/92528f0f300eebdb85d1eca796a846a7fdd1cb05))

## [0.3.1](https://github.com/antonebbage/typeguardkit/compare/0.3.0...0.3.1) (2022-07-18)

### Bug Fixes

- fix imports from https://deno.land/x/typeguardkit/mod.ts
  ([55e4090](https://github.com/antonebbage/typeguardkit/commit/55e40906fee0318405c6ad5db42ab96237f9feb3))

## [0.3.0](https://github.com/antonebbage/typeguardkit/compare/0.2.0...0.3.0) (2022-07-17)

### Features

- add `enumAsserter` function
  ([2b0d48d](https://github.com/antonebbage/typeguardkit/commit/2b0d48d0faabd388163f07dac1434b54630fabf7))
- add `objectIntersectionOf` function
  ([b091a63](https://github.com/antonebbage/typeguardkit/commit/b091a631b751be4eded33fefecf7c5679a0736e9))

### Bug Fixes

- correct `arrayOf` `TypeAssertionError` message
  ([5e01c9a](https://github.com/antonebbage/typeguardkit/commit/5e01c9a63f7158fe2f0b1984268ec0b8d8357912))
- correct `objectAsserter` `TypeAssertionError` message
  ([88e96e1](https://github.com/antonebbage/typeguardkit/commit/88e96e1d8f2ab3bb6a344907c37519d596cf9728))

## [0.2.0](https://github.com/antonebbage/typeguardkit/compare/0.1.0...0.2.0) (2022-07-09)

### ⚠ BREAKING CHANGES

- remove `nullOr` + `undefinedOr` functions
- rename `type` function to `typeAsserter`

### Features

- add `_null` and `_undefined` `Asserter`s
  ([075762f](https://github.com/antonebbage/typeguardkit/commit/075762fdd07245cdd8f5829b5b9027e7bbe5d9aa))
- add `literalUnionAsserter` function
  ([365a4b7](https://github.com/antonebbage/typeguardkit/commit/365a4b7ea71a1cc3f120944d319fe9e900948d76))
- remove `nullOr` + `undefinedOr` functions
  ([0945091](https://github.com/antonebbage/typeguardkit/commit/094509116dd89c9afba2eac3af1f3e8abae08211))
- rename `type` function to `typeAsserter`
  ([c29af83](https://github.com/antonebbage/typeguardkit/commit/c29af8338b10e6afc3bb1dc3c7d506ba6507e727))

## [0.1.0](https://github.com/antonebbage/typeguardkit/compare/ba0d2fa9fe1ec79403a2095f6ef899e1fe0ae4e8...0.1.0) (2022-07-02)

### Features

- add `arrayOf` function
  ([a25c3a4](https://github.com/antonebbage/typeguardkit/commit/a25c3a4a515589eda83d525b64edfec65027829c))
- add `Asserter` type + `errorMessage` function
  ([ba0d2fa](https://github.com/antonebbage/typeguardkit/commit/ba0d2fa9fe1ec79403a2095f6ef899e1fe0ae4e8))
- add `assertIs` function
  ([e89b717](https://github.com/antonebbage/typeguardkit/commit/e89b717b71e44ea237ea230145a3bd62b339a160))
- add `is` function
  ([55be207](https://github.com/antonebbage/typeguardkit/commit/55be207978ee0d73d59ed716e1ed6ce66ce2e4c1))
- add `nullOr` function
  ([96098e7](https://github.com/antonebbage/typeguardkit/commit/96098e741b6da226c68e665753c91c456b534c02))
- add `type` function + `Asserter`s
  ([f210d56](https://github.com/antonebbage/typeguardkit/commit/f210d567f126b7526fef1dfcf04526367ba3c44e))
- add `TypeAssertionError`
  ([241e34f](https://github.com/antonebbage/typeguardkit/commit/241e34ffe682aa6a634bb977decea8e6cf2154a9))
- add `undefinedOr` function
  ([f906499](https://github.com/antonebbage/typeguardkit/commit/f906499db92f03185fdef6b01ced443e5ef66713))
- add `unionOf` function
  ([4d4f05b](https://github.com/antonebbage/typeguardkit/commit/4d4f05bff7224d25db5f2581d59bc4e4ff3f225b))
- add object asserter type + factory function
  ([739f376](https://github.com/antonebbage/typeguardkit/commit/739f3761f7e94c8a70ac686b167d7925c41548eb))
