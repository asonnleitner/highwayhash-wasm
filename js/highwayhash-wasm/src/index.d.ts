import { WasmHighwayHash, Hash } from '../lib/highwayhash/highwayhash'

export declare const useSimd: () => boolean

interface HighwayHashOptions {
  key?: Uint8Array
  simd?: boolean
}
export declare const useHighwayHash: (options?: HighwayHashOptions) => Promise<{
  hasher: typeof WasmHighwayHash
  new: (key: Uint8Array) => WasmHighwayHash
  hash64: (data: Uint8Array) => Hash
  hash128: (data: Uint8Array) => Hash
  hash256: (data: Uint8Array) => Hash
}>

export {}
