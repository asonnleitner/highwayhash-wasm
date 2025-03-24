declare class Hash {
    private constructor();
    free(): void;
    toString(): string;
    toHex(): string;
    toBinary(): string;
    toOctal(): string;
    toBytes(): Uint8Array;
    toUint32Array(): Uint32Array;
    toBigUint64Array(): BigUint64Array;
}

declare class Hash_2 {
    private constructor();
    free(): void;
    toString(): string;
    toHex(): string;
    toBinary(): string;
    toOctal(): string;
    toBytes(): Uint8Array;
    toUint32Array(): Uint32Array;
    toBigUint64Array(): BigUint64Array;
}

export declare type HashType = Hash | Hash_2

/**
 * Options for initializing HighwayHash
 */
export declare interface HighwayHashOptions {
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
 * Result of initializing a HighwayHash instance
 */
export declare interface HighwayHashResult<T extends typeof WasmHighwayHash | typeof WasmHighwayHash_2> {
    hasher: T
    new: (key: Uint8Array) => T extends typeof WasmHighwayHash ? WasmHighwayHash : WasmHighwayHash_2
    hash64: (data: Uint8Array) => HashType
    hash128: (data: Uint8Array) => HashType
    hash256: (data: Uint8Array) => HashType
}

/**
 * Initialize HighwayHash with SIMD support
 */
export declare function useHighwayHash(options: HighwayHashOptions & { simd: true }): Promise<HighwayHashResult<typeof WasmHighwayHash_2>>

/**
 * Initialize HighwayHash without SIMD support
 */
export declare function useHighwayHash(options: HighwayHashOptions & { simd: false }): Promise<HighwayHashResult<typeof WasmHighwayHash>>

/**
 * Initialize HighwayHash with default options
 */
export declare function useHighwayHash(options?: HighwayHashOptions): Promise<HighwayHashResult<typeof WasmHighwayHash_2> | HighwayHashResult<typeof WasmHighwayHash>>

/**
 * Detects whether SIMD is supported in the current environment.
 */
export declare function useSimd(): boolean

declare class WasmHighwayHash {
    private constructor();
    free(): void;
    static new(key: Uint8Array): WasmHighwayHash;
    static hash64(key: Uint8Array, data: Uint8Array): Hash;
    static hash128(key: Uint8Array, data: Uint8Array): Hash;
    static hash256(key: Uint8Array, data: Uint8Array): Hash;
    append(data: Uint8Array): void;
    finalize64(): Hash;
    finalize128(): Hash;
    finalize256(): Hash;
}

declare class WasmHighwayHash_2 {
    private constructor();
    free(): void;
    static new(key: Uint8Array): WasmHighwayHash_2;
    static hash64(key: Uint8Array, data: Uint8Array): Hash_2;
    static hash128(key: Uint8Array, data: Uint8Array): Hash_2;
    static hash256(key: Uint8Array, data: Uint8Array): Hash_2;
    append(data: Uint8Array): void;
    finalize64(): Hash_2;
    finalize128(): Hash_2;
    finalize256(): Hash_2;
}

export { }
