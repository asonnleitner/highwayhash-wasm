import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import MagicString from 'magic-string'

interface ReplaceOptions {
  include?: RegExp
  exclude?: RegExp
  delimiters?: [string, string]
  values?: Record<string, string | ((...args: any[]) => string)>
  [key: string]: unknown
}

type ReplacementFunction = (id: string) => string
type ReplacementValues = Record<string, ReplacementFunction>

function toFunction(code: unknown): ReplacementFunction {
  return typeof code === 'function' ? code as ReplacementFunction : () => String(code)
}

const escape = (s: string): string => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
const longest = (a: string, b: string): number => b.length - a.length

function mapToFunctions(options: ReplaceOptions): ReplacementValues {
  const { delimiters, include, exclude, ...values } = options.values ? options.values : options

  return Object.keys(values).reduce((fns, key) => {
    const functions = Object.assign({}, fns)
    functions[key] = toFunction(values[key])
    return functions
  }, {} as ReplacementValues)
}

function generateFilter(options: ReplaceOptions): {
  include: RegExp
  exclude: RegExp | null
} {
  let include = /.*/
  let exclude = null
  let hasValidInclude = false

  if (options.include) {
    if (Object.prototype.toString.call(options.include) !== '[object RegExp]') {
      throw new TypeError(`include option must be a RegExp object`)
    }
    else {
      hasValidInclude = true
      include = options.include
    }
  }

  if (options.exclude) {
    if (Object.prototype.toString.call(options.exclude) !== '[object RegExp]') {
      throw new TypeError(`exclude option must be a RegExp object`)
    }
    else if (!hasValidInclude) {
      // Only if `options.include` not set, take `options.exclude`
      exclude = options.exclude
    }
  }

  return { include, exclude }
}

function replaceCode(code: string, id: string, pattern: RegExp, functionValues: ReplacementValues): string {
  const magicString = new MagicString(code)

  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(code))) {
    const start = match.index
    const end = start + match[0].length
    const replacement = String(functionValues[match[1]](id))
    magicString.overwrite(start, end, replacement)
  }

  return magicString.toString()
}

export default (options: ReplaceOptions = {} as any): Plugin => {
  const { include, exclude } = generateFilter(options)

  const fns = mapToFunctions(options)
  const empty = Object.keys(fns).length === 0
  const keys = Object.keys(fns).sort(longest).map(escape)

  const { delimiters } = options
  const pattern = delimiters
    ? new RegExp(
      `${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}`,
      'g',
    )
    : new RegExp(`\\b(${keys.join('|')})\\b`, 'g')
  return {
    name: 'replace',
    setup(build) {
      build.onLoad({ filter: include }, async (args) => {
        if (exclude && args.path.match(exclude))
          return

        const code = await fs.promises.readFile(args.path, 'utf8')

        const contents = empty
          ? code
          : replaceCode(code, args.path, pattern, fns)

        return { contents, loader: args.path.match(/tsx?$/) ? 'ts' : 'js' }
      })
    },
  }
}
