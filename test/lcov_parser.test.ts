import {describe, it} from 'node:test';
import * as fs from "node:fs";

describe('coverage percentage', () => {
    it('should return the 0%', () => {
        const fixture = fs.readFileSync('test/fixtures/0lcov.info.sample', 'utf8');

        // ## This should return 0 coverage
    });

    it('should return the 100%', () => {
        const fixture = fs.readFileSync('test/fixtures/100lcov.info.sample', 'utf8');

        // ## This should return 100% coverage
    });

    it('should return the 50%', () => {
        const fixture = fs.readFileSync('test/fixtures/50lcov.info.sample', 'utf8');

        // ## This should return 50% coverage
    });
})