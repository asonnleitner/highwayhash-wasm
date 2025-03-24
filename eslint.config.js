// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  pnpm: true,
  ignores: [
    'js/highwayhash-wasm/lib/**',
    'release.config.js',
    'README.md',
  ],
})
