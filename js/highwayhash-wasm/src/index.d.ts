import type { Hash as SimdHash } from '../lib/highwayhash-simd/highwayhash-simd'
import type { WasmHighwayHash as HighwayHashSimd } from '../lib/highwayhash-simd/highwayhash-simd'
import type { Hash } from '../lib/highwayhash/highwayhash'
import type { WasmHighwayHash as HighwayHash } from '../lib/highwayhash/highwayhash'

/**
 * Detects whether SIMD is supported in the current environment.
 */
export function useSimd(): boolean

export type HashType = Hash | SimdHash

/**
 * Result of initializing a HighwayHash instance
 */
export interface HighwayHashResult<T extends typeof HighwayHash | typeof HighwayHashSimd> {
  hasher: T
  new: (key: Uint8Array) => T extends typeof HighwayHash ? HighwayHash : HighwayHashSimd
  hash64: (data: Uint8Array) => HashType
  hash128: (data: Uint8Array) => HashType
  hash256: (data: Uint8Array) => HashType
}

/**
 * Options for initializing HighwayHash
 */
export interface HighwayHashOptions {
  /**
   * A 32-byte key for the hash function
   */
  key?: Uint8Array
  /**
   * Whether to use SIMD instructions if available
   */
  simd?: boolean
}

/**
 * Initialize HighwayHash with SIMD support
 */
export function useHighwayHash(options: HighwayHashOptions & { simd: true }): Promise<HighwayHashResult<typeof HighwayHashSimd>>

/**
 * Initialize HighwayHash without SIMD support
 */
export function useHighwayHash(options: HighwayHashOptions & { simd: false }): Promise<HighwayHashResult<typeof HighwayHash>>

/**
 * Initialize HighwayHash with default options
 */
export function useHighwayHash(options?: HighwayHashOptions): Promise<HighwayHashResult<typeof HighwayHashSimd> | HighwayHashResult<typeof HighwayHash>>
