import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mock } from 'cjs-mock';
import * as core from '@actions/core';
import * as fs from 'fs';
import * as main from '../src';

const index: typeof main = mock('../src', {
  '@actions/core': {
    ...core,
    getInput: (name: string) => name,
    getBooleanInput: (name: string) => true,
  },
  fs: {
    ...fs,
    readFileSync: (path: string) => 'test',
  },
});

describe('index.ts', () => {
  it('getInputs should return the correct inputs', () => {
    assert.deepEqual(index.getInputs(), {
      githubToken: 'github-token',
      workingDir: 'working-directory',
      lcovFile: 'working-directory/lcov-file',
      commentPr: true,
      title: 'title',
      primary_color: 'pie-covered-color',
      secondary_color: 'pie-not-covered-color',
      coverage_rate: 'include-coverage-less-than',
    });
  });

  it('getInputFilePath should return the correct file path', () => {
    assert.equal(
      index.getInputFilePath('test', 'nothing-found'),
      'working-directory/test',
    );
  });

  it('getInputValue should return the correct input value', () => {
    assert.equal(index.getInputValue('test'), 'test');
  });

  it('getInputBoolValue should return the correct boolean value', () => {
    assert.equal(index.getInputBoolValue('test'), true);
  });
});
