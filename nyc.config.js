module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  'check-coverage': false,
  reporter: ['lcov', 'text'],
  'skip-full': true,
  exclude: ['test/**/*.*', 'dist/**', '*.config.*', 'coverage/**'],
};
