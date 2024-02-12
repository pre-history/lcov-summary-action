module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  'check-coverage': true,
  reporter: ['lcov', 'text'],
  'skip-full': true,
  exclude: ['test/**/*.*', 'dist/**', '*.config.*', 'coverage/**'],
};
