// @ts-nocheck
import esbuild from 'esbuild'
import wasmPack from 'esbuild-plugin-wasm-pack'
import wasmLoader from './wasm-loader'
import { resolve } from 'path'
import { WasmPackOptions } from 'esbuild-plugin-wasm-pack/dist/options'

const outfile = resolve(__dirname, '../js/highway-wasm/dist/index.js')

const wasmPackage = (outName: string, options: WasmPackOptions) => {
  return wasmPack({
    path: resolve(__dirname, '../highway'),
    outName: outName,
    outDir: `../js/highway-wasm/lib/${outName}`,
    target: 'web',
    profile: 'release',
    noTypescript: false,
    ...options
  })
}

const build = async () => {
  await esbuild.build({
    entryPoints: [resolve(__dirname, '../js/index.ts')],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile,
    plugins: [
      wasmLoader(),
      wasmPackage('highway'),
      wasmPackage('highway-simd')
    ],
    watch: {
      onRebuild(err) {
        if (err) {
          console.error(err)
        } else {
          console.log(`${outfile} rebuilt`)
        }
      }
    }
  })

  console.log(`built ${outfile}`)
}

build().catch(console.error)
