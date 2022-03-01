if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    '\u001B[33mwarn\u001B[0m This script is intended to be run from inside of a PNPM project.'
  )
  process.exit(1)
}
