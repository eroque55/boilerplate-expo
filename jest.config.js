module.exports = {
  preset: 'jest-expo',
  resolver: require.resolve('react-native-reanimated/jest/resolver'),
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\.svg$': '<rootDir>/src/test/svg-mock.tsx',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/test/**',
    '!src/types/**',
  ],
};
