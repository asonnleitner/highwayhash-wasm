import type { WasmPackOptions } from 'esbuild-plugin-wasm-pack/dist/options'
import { resolve } from 'node:path'
// @ts-nocheck
import esbuild from 'esbuild'
import wasmPack from 'esbuild-plugin-wasm-pack'
import wasmLoader from './wasm-loader'

const outfile = resolve(__dirname, '../js/highwayhash-wasm/dist/index.js')

function wasmPackage(outName: string, options: WasmPackOptions) {
  return wasmPack({
    path: resolve(__dirname, '../highway'),
    outName,
    outDir: `../js/highwayhash-wasm/lib/${outName}`,
    target: 'web',
    profile: 'release',
    noTypescript: false,
    ...options,
  })
}

async function build() {
  await esbuild.build({
    entryPoints: [resolve(__dirname, '../js/index.ts')],
    bundle: true,
    minify: false,
    sourcemap: true,
    outfile,
    plugins: [
      wasmLoader(),
      wasmPackage('highway'),
      wasmPackage('highway-simd'),
    ],
    watch: {
      onRebuild(err) {
        if (err) {
          console.error(err)
        }
        else {
          console.log(`${outfile} rebuilt`)
        }
      },
    },
  })

  console.log(`built ${outfile}`)
}

build().catch(console.error)
