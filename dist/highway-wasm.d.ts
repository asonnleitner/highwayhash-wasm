/**
 */
declare class Hash {
    free(): void;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toHex(): string;
    /**
     * @returns {string}
     */
    toBinary(): string;
    /**
     * @returns {string}
     */
    toOctal(): string;
    /**
     * @returns {Uint8Array}
     */
    toBytes(): Uint8Array;
    /**
     * @returns {Uint32Array}
     */
    toUint32Array(): Uint32Array;
    /**
     * @returns {BigUint64Array}
     */
    toBigUint64Array(): BigUint64Array;
}

declare interface HighwayOptions {
    key?: Uint8Array
    simd?: boolean
}

export declare const useHighway: (
options?: HighwayOptions | undefined
) => Promise<{
    hasher: typeof WasmHighway
    new: (key: Uint8Array) => WasmHighway
    hash64: (data: Uint8Array) => Hash
    hash128: (data: Uint8Array) => Hash
    hash256: (data: Uint8Array) => Hash
}>;

export declare const useSimd: () => boolean;

/**
 */
declare class WasmHighway {
    free(): void;
    /**
     * @param {Uint8Array} key
     * @returns {WasmHighway}
     */
    static new(key: Uint8Array): WasmHighway;
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} data
     * @returns {Hash}
     */
    static hash64(key: Uint8Array, data: Uint8Array): Hash;
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} data
     * @returns {Hash}
     */
    static hash128(key: Uint8Array, data: Uint8Array): Hash;
    /**
     * @param {Uint8Array} key
     * @param {Uint8Array} data
     * @returns {Hash}
     */
    static hash256(key: Uint8Array, data: Uint8Array): Hash;
    /**
     * @param {Uint8Array} data
     */
    append(data: Uint8Array): void;
    /**
     * @returns {Hash}
     */
    finalize64(): Hash;
    /**
     * @returns {Hash}
     */
    finalize128(): Hash;
    /**
     * @returns {Hash}
     */
    finalize256(): Hash;
}

export { }
