import { describe, it } from 'node:test';
import * as fs from 'node:fs';
import assert from 'node:assert';
import { parseLcov, compareLcov, type ParseLcov, type CoverageDiff } from '../src/lcov_parser';

describe('coverage percentage', () => {
  it('should return the 0%', () => {
    const fixture = fs.readFileSync('test/fixtures/0lcov.info.sample', 'utf8');

    const result = parseLcov(fixture);
    // ## This should return 0% coverage
    assert.equal(result.percentage, 0);
  });

  it('should return the 50%', () => {
    const fixture = fs.readFileSync('test/fixtures/50lcov.info.sample', 'utf8');

    const result = parseLcov(fixture);
    // ## This should return 50% coverage
    assert.equal(result.percentage, 50);
  });

  it('should return the 100%', () => {
    const fixture = fs.readFileSync(
      'test/fixtures/100lcov.info.sample',
      'utf8',
    );

    const result = parseLcov(fixture);
    // ## This should return 100% coverage
    assert.equal(result.percentage, 100);
  });

  it('should return the 37.04%', () => {
    const fixture = fs.readFileSync(
      'test/fixtures/real-lcov.info.sample',
      'utf8',
    );

    // ## This should return 37.04% coverage
    assert.equal(parseLcov(fixture).percentage.toFixed(2), 37.04);
  });

  it('should return the 0% when there nothing to test', () => {
    const fixture = fs.readFileSync(
      'test/fixtures/empty-lcov.info.sample',
      'utf8',
    );
    const result = parseLcov(fixture);
    // ## This should return 0% coverage
    assert.equal(result.percentage, 0);
  });
});

describe('file-level parsing', () => {
  it('should parse individual file coverage', () => {
    const fixture = fs.readFileSync(
      'test/fixtures/real-lcov.info.sample',
      'utf8',
    );
    const result = parseLcov(fixture);

    // Should have file-level data
    assert.ok(result.files.length > 0, 'Should have parsed files');
    assert.equal(
      result.total_files,
      result.files.length,
      'total_files should match files array length',
    );

    // Check first file has expected structure
    const firstFile = result.files[0];
    assert.ok(firstFile.filename, 'File should have filename');
    assert.ok(
      typeof firstFile.covered === 'number',
      'File should have covered count',
    );
    assert.ok(
      typeof firstFile.total === 'number',
      'File should have total count',
    );
    assert.ok(
      typeof firstFile.percentage === 'number',
      'File should have percentage',
    );
  });
});

describe('coverage comparison', () => {
  it('should compare two coverage reports', () => {
    const current = parseLcov(
      fs.readFileSync('test/fixtures/50lcov.info.sample', 'utf8'),
    );
    const base = parseLcov(
      fs.readFileSync('test/fixtures/0lcov.info.sample', 'utf8'),
    );

    const diff = compareLcov(current, base);

    assert.ok(diff, 'Should return diff object');
    assert.ok(
      diff!.percentage_diff > 0,
      'Should show positive percentage change',
    );
    assert.ok(
      diff!.covered_diff > 0,
      'Should show positive covered lines change',
    );
  });

  it('should return null when no base provided', () => {
    const current = parseLcov(
      fs.readFileSync('test/fixtures/50lcov.info.sample', 'utf8'),
    );
    const diff = compareLcov(current);

    assert.equal(diff, null, 'Should return null when no base provided');
  });
});
