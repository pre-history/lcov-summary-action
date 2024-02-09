import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
interface Options {
  repository: string;
  workingDir: string;
  commit?: string;
  baseCommit?: string;
  head?: string;
  base?: string;
}
const REPO = github.context.payload.repository?.full_name!;
const WORKING_DIR = core.getInput('working-directory');
async function main() {
  const inputs = getInputs();
  const rawCoverageReport = await readFileSafe(inputs.lcovFile);
  if (!rawCoverageReport) {
    console.log(`No coverage report found at '${inputs.lcovFile}', exiting...`);
    return;
  }
  let baseRawCoverageReport = '';
  if (inputs.baseFile) {
    baseRawCoverageReport = await readFileSafe(inputs.baseFile);
    if (!baseRawCoverageReport)
      console.log(
        `No coverage report found at '${inputs.baseFile}', ignoring...`,
      );
  }
  let options: Options = getCommitDetails(inputs);
}
function getInputs() {
  const lcovFile = getInputFilePath(
    core.getInput('lcov-file'),
    './coverage/lcov.info',
  );
  const baseFile = getInputValue('lcov-base');
  return {
    githubToken: getInputValue('github-token'),
    workingDir: WORKING_DIR,
    lcovFile: lcovFile,
    baseFile: baseFile,
    title: getInputValue('title'),
    shouldFilterChangedFiles: getInputBoolValue('filter-changed-files'),
    shouldDeleteOldComments: getInputBoolValue('delete-old-comments'),
  };
}
function getInputFilePath(inputName: string, defaultValue: string): string {
  return path.join(WORKING_DIR, core.getInput(inputName) || defaultValue);
}

function getInputValue(inputName: string): string {
  return core.getInput(inputName);
}

function getInputBoolValue(inputName: string): boolean {
  return core.getBooleanInput(inputName);
}

async function readFileSafe(filepath: string) {
  return await fs.readFile(filepath, 'utf-8').catch((err) => null);
}

function getPullRequestOptions(): Partial<Options> {
  const payload = github.context.payload.pull_request!;
  return {
    commit: payload.head.sha,
    baseCommit: payload.base.sha,
    head: payload.head.ref,
    base: payload.base.ref,
  };
}
function getPushOptions(): Partial<Options> {
  return {
    commit: github.context.payload.after,
    baseCommit: github.context.payload.before,
    head: github.context.ref,
  };
}
function getCommitDetails(inputs: any): Options {
  let eventOptions: Partial<Options> = {};
  if (github.context.eventName === 'pull_request') {
    eventOptions = getPullRequestOptions();
  } else if (github.context.eventName === 'push') {
    eventOptions = getPushOptions();
  }
  return {
    repository: REPO,
    workingDir: WORKING_DIR,
    ...eventOptions,
  };
}
