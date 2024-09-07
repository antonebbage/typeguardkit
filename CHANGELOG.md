## [0.32.0](https://github.com/antonebbage/typeguardkit/compare/0.31.0...0.32.0) (2024-09-07)

### ⚠ BREAKING CHANGES

- require `typeName` argument in `OptionAsserter` constructor call
- change `NumberAsserterOptions.disallowNaN` to `canBeNaN`

### Features

- change `NumberAsserterOptions.disallowNaN` to `canBeNaN`
  ([96f2079](https://github.com/antonebbage/typeguardkit/commit/96f2079359aed9795795dc964d519fc478e92140))
- require `typeName` argument in `OptionAsserter` constructor call
  ([0fbeff3](https://github.com/antonebbage/typeguardkit/commit/0fbeff34e96f4a77f8ccd1f4679589c1adf24e49))

## [0.31.0](https://github.com/antonebbage/typeguardkit/compare/0.30.0...0.31.0) (2024-08-24)

### ⚠ BREAKING CHANGES

- remove `TypeAssertionError` issue tree

### Features

- make `NumberAsserter`, `StringAsserter`, + `ArrayAsserter` implement
  `Validator`
  ([c65fd34](https://github.com/antonebbage/typeguardkit/commit/c65fd348d76f0d76c33594e4e4d188eda202bac9))
- remove `TypeAssertionError` issue tree
  ([0204f24](https://github.com/antonebbage/typeguardkit/commit/0204f24aa4ea002217f95a4c5e54b4218b223fb6))

## [0.30.0](https://github.com/antonebbage/typeguardkit/compare/0.29.0...0.30.0) (2024-07-27)

### ⚠ BREAKING CHANGES

- the `OptionAsserter` generic type parameter has changed.
- the `RecordAsserter` generic type parameters have changed.
- the `ArrayAsserter` generic type parameter has changed.

### Features

- add `Asserted` utility type
  ([4f4b7e1](https://github.com/antonebbage/typeguardkit/commit/4f4b7e1ca18601ec1625e762f10cb78f4cb17659))
- allow `ArrayAsserter.elementAsserter` type to be more specific
  ([065bdbb](https://github.com/antonebbage/typeguardkit/commit/065bdbbe6858840735ddb645ebbb53df81ea6276))
- allow `OptionAsserter.definedTypeAsserter` type to be more specific
  ([458b186](https://github.com/antonebbage/typeguardkit/commit/458b1866bd0d2927826156f19dc0395b0854a14d))
- allow `RecordAsserter` asserter property types to be more specific
  ([474c820](https://github.com/antonebbage/typeguardkit/commit/474c820b1f6fc1b755ee7c9780cf993d082b08ca))

## [0.29.0](https://github.com/antonebbage/typeguardkit/compare/0.28.0...0.29.0) (2024-07-20)

### ⚠ BREAKING CHANGES

- change `undefined` `ArrayAsserter` properties to `null`
- `ArrayAsserterOptions` is now generic and is no longer implemented by
  `ArrayAsserter`.
- make `StringAsserter` `rules` `readonly`
- make `NumberAsserter` `rules` `readonly`

### Features

- add `ArrayAsserter` `rules` option
  ([ee33d50](https://github.com/antonebbage/typeguardkit/commit/ee33d50a9fcde9a5fe5913248b51c7806f412546))
- change `undefined` `ArrayAsserter` properties to `null`
  ([f043984](https://github.com/antonebbage/typeguardkit/commit/f043984b8ada5d68660651334ac839dba5bcfccf))

### Bug Fixes

- check type of elements before further validation in `ArrayAsserter.assert`
  ([0daf6c1](https://github.com/antonebbage/typeguardkit/commit/0daf6c196b7b7deab55081563755d317253bd886))
- make `NumberAsserter` `rules` `readonly`
  ([1794b02](https://github.com/antonebbage/typeguardkit/commit/1794b02d978b5f10db5c2db74f6858005b4b7030))
- make `StringAsserter` `rules` `readonly`
  ([9d164f9](https://github.com/antonebbage/typeguardkit/commit/9d164f9a106574755a57e19aeb43c626cc8b0734))

## [0.28.0](https://github.com/antonebbage/typeguardkit/compare/0.27.0...0.28.0) (2024-06-09)

### ⚠ BREAKING CHANGES

- change `undefined` `NumberAsserter` properties to `null`
- change `undefined` `StringAsserter` properties to `null`
- change `NumberAsserter` `validate` option to `rules`
- change `StringAsserter` `validate` option to `rules`

### Features

- change `ArrayAsserter` `mustBeASet` message
  ([3c47bb3](https://github.com/antonebbage/typeguardkit/commit/3c47bb366ea4b4a447196735aa578cb39abf25a1))
- change `NumberAsserter` `validate` option to `rules`
  ([d677f04](https://github.com/antonebbage/typeguardkit/commit/d677f04e94327d6b689913c309c5e523ec762cde))
- change `StringAsserter` `validate` option to `rules`
  ([285859b](https://github.com/antonebbage/typeguardkit/commit/285859b564ad6a56b58f547d7b539a06e0fa8095))
- change `undefined` `NumberAsserter` properties to `null`
  ([52d8021](https://github.com/antonebbage/typeguardkit/commit/52d8021824ef8b9182261159563307cacd0d1344))
- change `undefined` `StringAsserter` properties to `null`
  ([69d7e61](https://github.com/antonebbage/typeguardkit/commit/69d7e61b908a986c29a4591ea8afa9cba96edcef))

## [0.27.0](https://github.com/antonebbage/typeguardkit/compare/0.26.0...0.27.0) (2024-06-01)

### Features

- add `mustBeASet` to `ArrayAsserterOptions`
  ([5fbbb90](https://github.com/antonebbage/typeguardkit/commit/5fbbb90740efeb8e1a522602e65508cfc794de94))
- allow `LiteralUnionAsserter` `boolean` `values`
  ([e885943](https://github.com/antonebbage/typeguardkit/commit/e88594318f5f0a2b7670b638ef857e8309cafe02))
- allow passing property asserters to `ObjectIntersectionAsserter` constructor
  ([ce71555](https://github.com/antonebbage/typeguardkit/commit/ce715553d9ad2ae383f0c41fff27a0b8927b36c3))
- allow passing property asserters to `PartialAsserter` constructor
  ([f9ef297](https://github.com/antonebbage/typeguardkit/commit/f9ef297eb10ccbe3abc280c31d3409155544ef60))

## [0.26.0](https://github.com/antonebbage/typeguardkit/compare/0.25.0...0.26.0) (2024-05-25)

### ⚠ BREAKING CHANGES

- `pick` no longer accepts an `assertedTypeName` argument (use `PickAsserter`
  constructor to specify a `typeName`)
- `partial` no longer accepts an `assertedTypeName` argument (use
  `PartialAsserter` constructor to specify a `typeName`)
- `objectIntersection` no longer accepts an `assertedTypeName` argument (use
  `ObjectIntersectionAsserter` constructor to specify a `typeName`)

### Features

- add `ObjectIntersectionAsserter`
  ([549c2cd](https://github.com/antonebbage/typeguardkit/commit/549c2cd4ec00d595871cf1de6af3a994afb85ca4))
- add `PartialAsserter`
  ([eaed3cf](https://github.com/antonebbage/typeguardkit/commit/eaed3cf662a55b0195d31922e49ec68958c1e679))
- add `PickAsserter`
  ([f8747ff](https://github.com/antonebbage/typeguardkit/commit/f8747ff47ce626039d3a4b2283a573077403bc87))

## [0.25.0](https://github.com/antonebbage/typeguardkit/compare/0.24.0...0.25.0) (2024-02-25)

### Features

- simplify object type tooltip representations
  ([35948ea](https://github.com/antonebbage/typeguardkit/commit/35948ea0ec2e82728f85073ac6f95825a0a78fd5))

## [0.24.0](https://github.com/antonebbage/typeguardkit/compare/0.23.0...0.24.0) (2024-02-24)

### ⚠ BREAKING CHANGES

- generic type parameters have changed for the `ObjectAsserter` class and
  `objectIntersection`, `partial`, and `pick` functions.

### Bug Fixes

- make `ObjectAsserter` assert type with optional props where `OptionAsserter`
  specified
  ([2b98a23](https://github.com/antonebbage/typeguardkit/commit/2b98a23880ea951d5e6387bb4a087b098f1e0d42))

## [0.23.0](https://github.com/antonebbage/typeguardkit/compare/0.22.0...0.23.0) (2024-02-17)

### ⚠ BREAKING CHANGES

- rename `pickFrom` to `pick`
- rename `partialFrom` to `partial`
- rename `objectIntersectionOf` to `objectIntersection`
- rename `unionOf` to `union`
- rename `recordOf` to `record`
- rename `optionOf` to `option`
- rename `arrayOf` to `array`

### Features

- rename `arrayOf` to `array`
  ([8588245](https://github.com/antonebbage/typeguardkit/commit/858824539b2682e8963f1bc68286ac542e8f3259))
- rename `objectIntersectionOf` to `objectIntersection`
  ([cfd4581](https://github.com/antonebbage/typeguardkit/commit/cfd4581f54542ba601631679d38142afc9702306))
- rename `optionOf` to `option`
  ([0bf26e5](https://github.com/antonebbage/typeguardkit/commit/0bf26e5ed54224fec2ee529d0dc0f124b8a87424))
- rename `partialFrom` to `partial`
  ([bf09128](https://github.com/antonebbage/typeguardkit/commit/bf091284a8acf22505dffc785c5e5ea91ab936f3))
- rename `pickFrom` to `pick`
  ([83420be](https://github.com/antonebbage/typeguardkit/commit/83420be4541dea776d3389e25cb969be6700d0d2))
- rename `recordOf` to `record`
  ([25cf21b](https://github.com/antonebbage/typeguardkit/commit/25cf21b4d3fce736148a7063129875c32325cca2))
- rename `unionOf` to `union`
  ([38dd256](https://github.com/antonebbage/typeguardkit/commit/38dd256e491510891d9376bad700619b95b28951))

## [0.22.0](https://github.com/antonebbage/typeguardkit/compare/0.21.0...0.22.0) (2024-02-10)

### ⚠ BREAKING CHANGES

- `Asserter.asserterTypeName` removed (use `instanceof` instead); `Asserter`
  type name `string`s removed; `Asserter.assertedTypeName` renamed to
  `typeName`; `Asserter`s no longer functions (call their `assert` method
  instead); `typeAsserter`, `numberAsserter`, `stringAsserter`,
  `literalUnionAsserter`, `enumAsserter`, and `objectAsserter` functions removed
  (use corresponding PascalCase class constructors instead); `unionOf` only
  accepts the `memberAsserters` rest parameter (use `UnionAsserter` constructor
  to specify a `typeName`); `arrayOf` only accepts the `elementAsserter`
  parameter (use `ArrayAsserter` constructor to specify a `typeName` and
  `ArrayAsserterOptions`); `recordOf` only accepts the `keyAsserter` and
  `valueAsserter` parameters (use `RecordAsserter` constructor to specify a
  `typeName`).

### Features

- implement `Asserter`s using classes
  ([7998ff7](https://github.com/antonebbage/typeguardkit/commit/7998ff774597b2e67abf6c431ae93df3dfd94c82))

## [0.21.0](https://github.com/antonebbage/typeguardkit/compare/0.20.0...0.21.0) (2024-01-27)

### ⚠ BREAKING CHANGES

- return `ArrayAsserter` from `arrayOf`

### Features

- change `arrayOf` length error messages
  ([c59d4ea](https://github.com/antonebbage/typeguardkit/commit/c59d4ea0d7f6577d83a6b57cfde545b02c276b37))
- change `StringAsserter` length error messages
  ([2e80cfc](https://github.com/antonebbage/typeguardkit/commit/2e80cfc8d899e6881f1bec32a4db5325c3b2fe4e))
- return `ArrayAsserter` from `arrayOf`
  ([afe619b](https://github.com/antonebbage/typeguardkit/commit/afe619b9d39ea4219f119b1fee83e0e6d4fdd0d5))

## [0.20.0](https://github.com/antonebbage/typeguardkit/compare/0.19.0...0.20.0) (2024-01-20)

### ⚠ BREAKING CHANGES

- the `arrayOf` `arrayTypeName` parameter has moved up a position.

### Features

- allow `Array<string | TypeAssertionError>` for
  `TypeAssertionErrorOptions.issues`
  ([b5aed3b](https://github.com/antonebbage/typeguardkit/commit/b5aed3b9c1d770f1783d091a547059e59eae2ec1))
- allow specifying `arrayOf` `minLength` + `maxLength`
  ([5240896](https://github.com/antonebbage/typeguardkit/commit/5240896ab3845d315531c9e386fccb2fa335bf99))

## [0.19.0](https://github.com/antonebbage/typeguardkit/compare/0.18.0...0.19.0) (2024-01-13)

### ⚠ BREAKING CHANGES

- compile `StringAsserter` `regex` with `v` flag

### Features

- compile `StringAsserter` `regex` with `v` flag
  ([bdd80d8](https://github.com/antonebbage/typeguardkit/commit/bdd80d8da794053a9876870f8fd484203866fe5a))

### Performance Improvements

- simplify `NumberAsserter` expressions
  ([a60f58c](https://github.com/antonebbage/typeguardkit/commit/a60f58c135bb6154a91f3c2be27cdb1d74ba4203))

## [0.18.0](https://github.com/antonebbage/typeguardkit/compare/0.17.0...0.18.0) (2024-01-06)

### ⚠ BREAKING CHANGES

- requires TypeScript version >= 5.0 (Deno version >= 1.32)

### Features

- add `const` modifier to `literalUnionAsserter` `Values` parameter
  ([e023c0a](https://github.com/antonebbage/typeguardkit/commit/e023c0acb2f1f462634959439f934305ddf6ab78))

## [0.17.0](https://github.com/antonebbage/typeguardkit/compare/0.16.0...0.17.0) (2023-06-17)

### Features

- add `optionOf` function
  ([0c79be9](https://github.com/antonebbage/typeguardkit/commit/0c79be9700c186284ea2c5c31f522ff6eac56e41))
- allow optional `ObjectAsserter` `Type` properties
  ([a44c3eb](https://github.com/antonebbage/typeguardkit/commit/a44c3ebd6b85f5fbb251c17774eb8eb08301b5b9))
- make `partialFrom` set `propertyAsserters` to `OptionAsserter`s
  ([1d3a732](https://github.com/antonebbage/typeguardkit/commit/1d3a73209758f234191c1d114bba760157bcacbd))

## [0.16.0](https://github.com/antonebbage/typeguardkit/compare/0.15.0...0.16.0) (2023-06-03)

### Features

- add `StringAsserterOptions` `regex` property
  ([bda8c73](https://github.com/antonebbage/typeguardkit/commit/bda8c7362d3cd66f093e80bcbf512da1beae478b))

### Performance Improvements

- prevent redundant condition check
  ([be7e2f6](https://github.com/antonebbage/typeguardkit/commit/be7e2f6209ce34f8b42a9f0de5e019ced23f1d7d))

## [0.15.0](https://github.com/antonebbage/typeguardkit/compare/0.14.0...0.15.0) (2023-04-22)

### Features

- add `StringAsserter.minLength` + `maxLength`
  ([b041645](https://github.com/antonebbage/typeguardkit/commit/b041645c0f854298a3cd7a970702f113945ddeea))

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
