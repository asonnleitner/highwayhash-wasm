extern crate web_sys;

use highway::{HighwayHash, HighwayHasher, Key};
use wasm_bindgen::prelude::*;
use web_sys::console;

mod utils;

macro_rules! log {
    ( $( $t:tt)* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) { console::time_end_with_label(self.name) }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn to_lanes(d: &[u8]) -> [u64; 4] {
    let mut result = [0u64; 4];
    for i in 0..4 {
        result[i] = u64::from_le_bytes(d[i * 8..(i + 1) * 8].try_into().unwrap());
    }
    result
}

#[wasm_bindgen]
pub struct Hash {
    hash: Vec<u64>,
}

// type for numeral system options
pub enum NumeralSystem {
    Decimal = 0,
    Hexadecimal = 1,
    Binary = 2,
    Octal = 3,
}

#[wasm_bindgen]
impl Hash {
    // default function for string outputs
    fn base_conversion(self, ns: NumeralSystem) -> String {
        let mut result = String::new();
        match ns {
            NumeralSystem::Decimal => for i in self.hash {
                result.push_str(&format!("{}", i));
            }
            NumeralSystem::Hexadecimal => for i in self.hash {
                result.push_str(&format!("{:X}", i));
            }
            NumeralSystem::Binary => for i in self.hash {
                result.push_str(&format!("{:b}", i));
            }
            NumeralSystem::Octal => for i in self.hash {
                result.push_str(&format!("{:o}", i));
            }
        }
        result
    }
    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(self) -> String { self.base_conversion(NumeralSystem::Decimal) }
    #[wasm_bindgen(js_name = toHex)]
    pub fn to_hex(self) -> String { self.base_conversion(NumeralSystem::Hexadecimal) }
    #[wasm_bindgen(js_name = toBinary)]
    pub fn to_binary(self) -> String { self.base_conversion(NumeralSystem::Binary) }
    #[wasm_bindgen(js_name = toOctal)]
    pub fn to_octal(self) -> String { self.base_conversion(NumeralSystem::Octal) }

    #[wasm_bindgen(js_name = toBytes)]
    pub fn to_bytes(self) -> Vec<u8> {
        let mut bytes = Vec::new();
        for i in self.hash.iter() {
            bytes.extend_from_slice(&i.to_le_bytes());
        }
        bytes
    }

    #[wasm_bindgen(js_name = toUint32Array)]
    pub fn to_u32_bytes(self) -> Vec<u32> {
        let mut bytes = Vec::new();
        for i in self.hash.iter() {
            bytes.push(i.to_le_bytes()[4] as u32);
        }
        bytes
    }

    #[wasm_bindgen(js_name = toUint64Array)]
    pub fn to_u64_bytes(self) -> Vec<u64> {
        self.hash.clone()
    }
}

#[wasm_bindgen]
pub struct WasmHighway {
    hasher: HighwayHasher,
}

#[wasm_bindgen]
impl WasmHighway {
    fn hasher(key: &[u8]) -> HighwayHasher {
        // console_error_panic_hook::set_once();
        return HighwayHasher::new(if key.is_empty() {
            Key::default()
        } else {
            Key(to_lanes(key))
        });
    }

    pub fn new(key: &[u8]) -> Self {
        WasmHighway {
            hasher: Self::hasher(key),
        }
    }

    pub fn hash64(key: &[u8], data: &[u8]) -> Hash { Hash { hash: [Self::hasher(key).hash64(data)].to_vec() } }

    pub fn hash128(key: &[u8], data: &[u8]) -> Hash { Hash { hash: Self::hasher(key).hash128(data).to_vec() } }

    pub fn hash256(key: &[u8], data: &[u8]) -> Hash { Hash { hash: Self::hasher(key).hash256(data).to_vec() } }

    pub fn append(&mut self, data: &[u8]) {
        self.hasher.append(data);
    }

    pub fn finalize64(self) -> Hash {
        Hash { hash: [self.hasher.finalize64()].to_vec() }
    }

    pub fn finalize128(self) -> Hash {
        Hash { hash: self.hasher.finalize128().to_vec() }
    }

    pub fn finalize256(self) -> Hash {
        Hash { hash: self.hasher.finalize256().to_vec() }
    }
}
