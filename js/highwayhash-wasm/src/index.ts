import type { Hash as SimdHash } from '../lib/highwayhash-simd/highwayhash-simd'
import type { Hash } from '../lib/highwayhash/highwayhash'
import initSimd, { WasmHighwayHash as HighwayHashSimd } from '../lib/highwayhash-simd/highwayhash-simd'
import simdWASM from '../lib/highwayhash-simd/highwayhash-simd_bg.wasm'
import init, { WasmHighwayHash as HighwayHash } from '../lib/highwayhash/highwayhash'
import WASM from '../lib/highwayhash/highwayhash_bg.wasm'

// https://github.com/GoogleChromeLabs/wasm-feature-detect/blob/master/src/detectors/simd/module.wat
export function useSimd(): boolean {
  return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]))
}

export type HashType = Hash | SimdHash

export interface HighwayHashResult<T extends typeof HighwayHash | typeof HighwayHashSimd> {
  hasher: T
  new: (key: Uint8Array) => T extends typeof HighwayHash ? HighwayHash : HighwayHashSimd
  hash64: (data: Uint8Array) => HashType
  hash128: (data: Uint8Array) => HashType
  hash256: (data: Uint8Array) => HashType
}

function useModule<T extends typeof HighwayHash | typeof HighwayHashSimd>(hasher: T): (key: Uint8Array) => HighwayHashResult<T> {
  return (key: Uint8Array) => {
    if (key.length && key.length !== 32)
      throw new Error('Key must be 32 bytes')

    return {
      hasher,
      new: ((key: Uint8Array) => hasher.new(key)) as (key: Uint8Array) => T extends typeof HighwayHash ? HighwayHash : HighwayHashSimd,
      hash64: (data: Uint8Array) => {
        const hh = hasher.new(key)
        hh.append(data)
        return hh.finalize64()
      },
      hash128: (data: Uint8Array) => {
        const hh = hasher.new(key)
        hh.append(data)
        return hh.finalize128()
      },
      hash256: (data: Uint8Array) => {
        const hh = hasher.new(key)
        hh.append(data)
        return hh.finalize256()
      },
    }
  }
}

export interface HighwayHashOptions {
  key?: Uint8Array
  simd?: boolean
}

export function useHighwayHash(options: HighwayHashOptions & { simd: true }): Promise<HighwayHashResult<typeof HighwayHashSimd>>
export function useHighwayHash(options: HighwayHashOptions & { simd: false }): Promise<HighwayHashResult<typeof HighwayHash>>
export function useHighwayHash(options?: HighwayHashOptions): Promise<HighwayHashResult<typeof HighwayHashSimd> | HighwayHashResult<typeof HighwayHash>>
export async function useHighwayHash(options?: HighwayHashOptions): Promise<HighwayHashResult<typeof HighwayHashSimd> | HighwayHashResult<typeof HighwayHash>> {
  const simd = useSimd() && options && options.simd !== undefined ? Boolean(options.simd) : true
  simd ? await initSimd(simdWASM) : await init(WASM)
  return useModule(simd ? HighwayHashSimd : HighwayHash)(options && options.key ? options.key : Uint8Array.from({ length: 32 }))
}
