import { describe, it } from 'node:test';
import * as fs from 'node:fs';
import assert from 'node:assert';
import { parseLcov } from '../src/lcov_parser.ts';

describe('coverage percentage', () => {
  it('should return the 0%', () => {
    const fixture = fs.readFileSync('test/fixtures/0lcov.info.sample', 'utf8');

    // ## This should return 0% coverage
    assert.equal(parseLcov(fixture).percentage, 0);
  });

  it('should return the 50%', () => {
    const fixture = fs.readFileSync('test/fixtures/50lcov.info.sample', 'utf8');

    // ## This should return 50% coverage
    assert.equal(parseLcov(fixture).percentage, 50);
  });

  it('should return the 100%', () => {
    const fixture = fs.readFileSync(
      'test/fixtures/100lcov.info.sample',
      'utf8',
    );

    // ## This should return 100% coverage
    assert.equal(parseLcov(fixture).percentage, 100);
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
    // ## This should return 0% coverage
    assert.equal(parseLcov(fixture).percentage, 0);
  });
});
