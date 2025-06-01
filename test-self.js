#!/usr/bin/env bun

// Set up GitHub Actions environment
process.env.INPUT_LCOV_FILE = './coverage/lcov.info';
process.env.INPUT_DETAILED_SUMMARY = 'true';
process.env.INPUT_GENERATE_BADGE = 'true';
process.env.INPUT_BADGE_STYLE = 'for-the-badge';
process.env.INPUT_COMMENT_ON_PR = 'false';
process.env.INPUT_COVERAGE_THRESHOLD = '50';
process.env.INPUT_TITLE = 'LCovMan Self-Test Coverage';
process.env.GITHUB_WORKSPACE = process.cwd();

// Mock GitHub context
process.env.GITHUB_EVENT_NAME = 'push';
process.env.GITHUB_SHA = 'abc123';
process.env.GITHUB_REF = 'refs/heads/main';
process.env.GITHUB_REPOSITORY = 'pre-history/lcov-summary-action';

// Import and run the action
require('./dist/index.js');

console.log('🦕 LCovMan self-test completed! Check the action summary above.');