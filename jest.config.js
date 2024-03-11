module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest/setup.js'],
  resolver: './jest/resolver.js',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|js|tsx|jsx)'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-itertools)',
  ],
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,ts,jsx,tsx}', '!**/*.d.ts'],
};
