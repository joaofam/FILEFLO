module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: ['<rootDir>/src/test/**/*.test.{js,jsx,ts,tsx}'],
  transformIgnorePatterns: ['/node_modules/(?!axios).+\\.js$'],
  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@aws-amplify/ui-react/styles.css': '<rootDir>/__mocks__/styleMock.js',
    '@fontsource/space-grotesk': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/setupTests.js']
};
