import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { parseLcov } from './lcov_parser';
import { generateSummary } from './summary';
/**
 * Represents the options for a particular operation.
 * @interface
 */
interface Options {
  repository: string;
  workingDir: string;
  commit?: string;
  baseCommit?: string;
  head?: string;
  base?: string;
}
/**
 * The REPO variable contains the full name of the repository from the GitHub context payload.
 * It is extracted using optional chaining and the nullish coalescing operator to handle null or undefined values.
 *
 * @type {string}
 */
const REPO = github.context.payload.repository?.full_name!;
/**
 * Represents the working directory.
 *
 * @type {string}
 */
const WORKING_DIR = core.getInput('working-directory');
/**
 * Entry point of the program.
 *
 * @async
 * @function main
 * @returns {void}
 */
async function main() {
  const inputs = getInputs();
  const rawCoverageReport = readFileSafe(inputs.lcovFile);
  if (!rawCoverageReport) {
    console.log(`No coverage report found at '${inputs.lcovFile}', exiting...`);
    return;
  }
  const result = parseLcov(rawCoverageReport.toString());
  const summary = generateSummary(result.covered, result.not_covered, {
    title: inputs.title,
    primary_color: inputs.primary_color,
    secondary_color: inputs.secondary_color,
  });
  const context = github.context;

  if (context.payload.pull_request) {
    const pull_request_number = context.payload.pull_request.number;
    core.info(pull_request_number.toString());
    core.info(inputs.githubToken);
    const octokit = new github.getOctokit(inputs.githubToken);
    core.info(octokit)
    await octokit.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pull_request_number,
      body: summary,
    });
  }

  await core.summary.addRaw(summary).write();
}
/**
 * Retrieves the inputs required for the operation.
 *
 * @return {Object} The input values.
 */
export function getInputs() {
  const lcovFile = getInputFilePath(
    core.getInput('lcov-file'),
    './coverage/lcov.info',
  );
  const baseFile = getInputValue('lcov-base');
  return {
    githubToken: getInputValue('github-token'),
    workingDir: WORKING_DIR,
    lcovFile: lcovFile,
    title: getInputValue('title'),
    primary_color: getInputValue('pie-covered-color'),
    secondary_color: getInputValue('pie-not-covered-color'),
  };
}
/**
 * Returns the input file path based on the input name and default value.
 *
 * @param {string} inputName - The name of the input.
 * @param {string} defaultValue - The default value to use if the input is not set.
 * @return {string} The input file path.
 */
export function getInputFilePath(
  inputName: string,
  defaultValue: string,
): string {
  return path.join(WORKING_DIR, core.getInput(inputName) || defaultValue);
}

/**
 * Retrieves the value of the specified input.
 *
 * @param {string} inputName - The name of the input.
 * @return {string} The value of the input.
 */
export function getInputValue(inputName: string): string {
  return core.getInput(inputName);
}

/**
 * Returns the boolean value of the specified input.
 *
 * @param {string} inputName - The name of the input for which to retrieve the boolean value.
 * @return {boolean} The boolean value of the input.
 */
export function getInputBoolValue(inputName: string): boolean {
  return core.getBooleanInput(inputName);
}

/**
 * Reads a file from the specified file path safely.
 *
 * @param {string} filepath - The path to the file to be read.
 * @returns {string} - A Promise that resolves with the file content as a string if the file is successfully read, or null if an error occurs.
 */
export function readFileSafe(filepath: string) {
  return fs.readFileSync(filepath, 'utf8');
}

/**
 * Retrieves the pull request options for a GitHub pull request.
 *
 * @returns {Partial<Options>} - The pull request options.
 */
export function getPullRequestOptions(): Partial<Options> {
  const payload = github.context.payload.pull_request!;
  return {
    commit: payload.head.sha,
    baseCommit: payload.base.sha,
    head: payload.head.ref,
    base: payload.base.ref,
  };
}
/**
 * Retrieves the push options for a GitHub action workflow.
 *
 * @returns {Partial<Options>} The push options for the workflow.
 */
export function getPushOptions(): Partial<Options> {
  return {
    commit: github.context.payload.after,
    baseCommit: github.context.payload.before,
    head: github.context.ref,
  };
}
/**
 * Retrieves commit details based on the input.
 *
 * @param {any} inputs - The inputs used to determine the commit details.
 * @return {Options} - The commit details.
 */
export function getCommitDetails(inputs: any): Options {
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

main().catch(function (err) {
  console.log(err);
  core.setFailed(err.message);
});
