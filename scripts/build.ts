import { resolve } from 'node:path'
import process from 'node:process'
import esbuild from 'esbuild'
import minimist from 'minimist'
import pkg from '../package.json'
import replace from './esbuild-replace'
import wasmLoader from './wasm-loader'

const args = minimist(process.argv.slice(2))
const target = args._[0] || 'highwayhash-wasm'
const format = args.f || args.format || 'global'

console.log(`Building ${target}.${format}.js...`)

const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
    ? 'cjs'
    : 'esm'

const outfile = resolve(__dirname, `../dist/${target}.${format}.js`)

async function build() {
  await esbuild.build({
    entryPoints: [resolve(__dirname, '../js/highwayhash-wasm/src/index.ts')],
    outfile,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: outputFormat,
    globalName: 'WasmHighwayHash',
    platform: format === 'cjs' ? 'node' : 'browser',
    plugins: [
      wasmLoader(),
      replace({
        'import.meta.url': 'input',
      }),
    ],
    define: {
      __VERSION__: `"${pkg.version}"`,
      __BROWSER__: String(format !== 'cjs'),
      __NODE_JS__: String(format === 'cjs'),
    },
  })
}

build().catch(console.error)
