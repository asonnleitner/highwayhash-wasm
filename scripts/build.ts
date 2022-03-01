// @ts-nocheck
import esbuild from 'esbuild'
import wasmLoader from './wasm-loader'
import { resolve } from 'path'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))
const target = args._[0] || 'highway-wasm'
const format = args.f || args.format || 'global'
import pkg from '../package.json'

console.log(`Building ${target}.${format}.js...`)

const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'

const outfile = resolve(__dirname, `../dist/${target}.${format}.js`)

const build = async () => {
  await esbuild.build({
    entryPoints: [resolve(__dirname, '../js/highway-wasm/index.ts')],
    outfile,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: outputFormat,
    globalName: 'WasmHighway',
    platform: format === 'cjs' ? 'node' : 'browser',
    plugins: [wasmLoader()],
    define: {
      __VERSION__: `"${pkg.version}"`,
      __BROWSER__: String(format !== 'cjs'),
      __NODE_JS__: String(format === 'cjs')
    }
  })
}

build().catch(console.error)
