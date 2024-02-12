module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  'check-coverage': true,
  exclude: ['test/**/*.*', 'dist/**', '*.config.*'],
};
