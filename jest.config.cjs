module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  setupFiles: ['<rootDir>/src/test/import-meta-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp)$':
      '<rootDir>/src/test/__mocks__/fileMock.js',
    '^@/services/tmdb$': '<rootDir>/src/services/__mocks__/tmdb.ts'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '!**/__tests__/**/*.old.*',
    '!**/__tests__/**/*.fixed.*',
    '!**/__tests__/**/*.working.*',
    '!**/__tests__/**/*.corrected.*',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/contexts/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    '!src/components/ui/toaster.tsx',
    '!src/components/ui/sidebar.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          module: 'esnext',
          target: 'esnext',
          moduleResolution: 'node',
        },
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
    '<rootDir>/coverage/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
