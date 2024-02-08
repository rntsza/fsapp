module.exports = {
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules', '/.next/'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts(x)'],
    setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        'tailwindcss/(.*)': 'identity-obj-proxy',
    },
}