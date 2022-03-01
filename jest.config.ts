import { InitialOptionsTsJest, pathsToModuleNameMapper } from 'ts-jest'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      useESM: true
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./tsconfig.json').compilerOptions.paths,
    {
      prefix: '<rootDir>/'
    }
  )
  // transform: {
  //   '^.+\\.(ts|js)x?$': 'ts-jest'
  // },
  // transformIgnorePatterns: ['js/highwayhash-wasm/lib/(?!(highway|highway-simd))']
}

export default config
