import { Config, createConfig } from '@umijs/test';

export default {
  ...createConfig(),
  collectCoverageFrom: ['src/**/*.{ts,js,tsx,jsx}'],
  coveragePathIgnorePatterns: ['src/types.d.ts'],
} as Config.InitialOptions;
