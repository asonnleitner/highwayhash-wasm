![highway-wasm](./docs/preview.png)

# highway-wasm

[![npm version][npm-version-src]][npm-href]
[![npm downloads][npm-downloads-src]][npm-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][npm-href]

> JS bindings for browser and Node.js environment of the Rust implementation of HighwayHash, Google's fast, keyed, portable 
> (output is hardware independent) and secure hash function.

## Features

- Run on Node.js and browser with same API
- Zero dependencies
- Prebuilt and optimized WASM binary
- Generate hashes at over 2GB/s when running on SIMD enabled WebAssembly
- Generate 64, 128 and 256 bit hashes
- Output hash as string, hexadecimal string
- Hash data in chunks

## Install

Add `highway-wasm` dependency to your project:

```shell
# using npm
npm i highway-wasm

# using yarn
yarn add highway-wasm

# using pnpm
pnpm add highway-wasm
```

## Usage

Use this method to generate hashes is the length of the data is not known in advance:

```javascript
// import the library using esm or cjs syntax
import { useHighway } from 'highway-wasm'
const { useHighway } = require('highway-wasm')

// Some 32 byte key
const key = new Uint8Array(32).fill(8)
// Some data to hash
const data = Uint8Array.from([0])

// Load the wasm module which returns the the Highway object
const highway = await useHighway({
  // Optional: pass a key and keep it hidden from attackers to ensure
  // unpredictability, and attackers can't mount a DoS attack
  key: key,
  // Optional: use SIMD for faster encryption, enabled by default
  simd: true
})

// 1. method - encrypt data with Highway and return the hash
const h1 = highway.hash64(data).toString()
console.log(h1) // 4652207699671410156

// 2. method - if the data to hash is not known, create a hasher, and append
// the data.
const hasher = highway.new(key)
hasher.append(data)
// After all data is appended, call the hash method to get the hash
// do not call any additional methods on the hasher after finalizing
const h2 = hasher.finalize64().toString()
console.log(h2) // 4652207699671410156

// 3. method - hash the data with separate key and data
const h3 = highway.hasher.hash64(key, data).toString()
console.log(h3) // 4652207699671410156

```

## API

## `hasher`

The hasher initializes with SIMD if supported.

## `hash`

The following methods are available to output hashes:

### `toString`
```javascript
// returns the hash as a string
const hash = hasher.hash64(key, data).toString()
```
### `toHex`
```javascript
// returns the hash as a hexadecimal string
const hash = hasher.hash64(key, data).toHex()
```
### `toBinary`
```javascript
// returns the hash as a binary string
const hash = hasher.hash64(key, data).toBinary()
```
### `toOctal`
```javascript
// returns the hash as an octal string
const hash = hasher.hash64(key, data).toOctal()
```
### `toBytes`
```javascript
// returns the hash as a Uint8Array
const hash = hasher.hash64(key, data).toBytes()
```
### `toUint32Array`
```javascript
// returns the hash as a Uint32Array
const hash = hasher.hash64(key, data).toUint32Array()
```
### `toUint64Array`
```javascript
// returns the hash as a Uint64Array
const hash = hasher.hash64(key, data).toUint64Array()
```



<!-- badges -->
[npm-version-src]: https://badgen.net/npm/v/highway-wasm
[npm-href]: https://www.npmjs.com/package/highway-wasm
[npm-downloads-src]: https://badgen.net/npm/dm/highway-wasm
[github-actions-ci-src]: https://github.com/asonnleitner/highway-wasm/actions/workflows/ci.yaml/badge.svg
[github-actions-ci-href]: https://github.com/asonnleitner/highway-wasm/actions/workflows/ci.yaml

[license-src]: https://badgen.net/npm/license/highway-wasm
