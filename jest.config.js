module.exports = {
    preset: 'ts-jest',                  // Use ts-jest to process TypeScript files
    testEnvironment: 'jsdom',             // Specify the environment (node or jsdom)
    testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'], // Define test file patterns
    moduleFileExtensions: ['ts', 'js', 'json'], // Recognize these extensions in imports
  };
  