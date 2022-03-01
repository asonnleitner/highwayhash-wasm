import { WasmHighway, Hash } from '../lib/highway/highway.js';

export declare const useSimd: () => boolean;

interface HighwayOptions {
    key?: Uint8Array;
    simd?: boolean;
}
export declare const useHighway: (options?: HighwayOptions | undefined) => Promise<{
    hasher: typeof WasmHighway;
    new: (key: Uint8Array) => WasmHighway;
    hash64: (data: Uint8Array) => Hash;
    hash128: (data: Uint8Array) => Hash;
    hash256: (data: Uint8Array) => Hash;
}>;

export {};
