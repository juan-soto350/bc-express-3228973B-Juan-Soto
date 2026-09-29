import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  // mongodb-memory-server puede tardar en arrancar
  testTimeout: 30000,
  clearMocks: true,
  // Permite resolver los imports con extensión .js (NodeNext) hacia los .ts reales
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/types/**',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 75,
      lines: 70,
    },
  },
};

export default config;
