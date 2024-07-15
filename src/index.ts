import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { parseLcov } from './lcov_parser';
import { generateSummary } from './summary';
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
    core.summary.addTable([
      [
        { data: 'Details', header: true },
        { data: 'Result', header: true },
      ],
      ['Coverage file', inputs.lcovFile],
      ['Coverage file exist', (!!rawCoverageReport).toString()],
      ['Coverage file entries', '0'],
      ['Total Covered', '0'],
      ['Total Uncovered', '0'],
    ]);
    console.log(`No coverage report found at '${inputs.lcovFile}', exiting...`);
    return;
  }
  if (inputs.debugLcov) {
    console.log('====================LCOV FILE REPORT====================');
    console.log(rawCoverageReport.toString());
    console.log('========================================================');
  }

  const result = parseLcov(rawCoverageReport.toString());
  const summary = generateSummary(result.covered, result.not_covered, {
    title: inputs.title,
    primary_color: inputs.primary_color,
    secondary_color: inputs.secondary_color,
  });
  const context = github.context;
  if (
    context.payload.pull_request &&
    github.context.payload.action === 'opened' &&
    inputs.commentPr
  ) {
    const pull_request_number = context.payload.pull_request.number;
    const octokit = new github.getOctokit(inputs.githubToken);

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pull_request_number,
      body: summary,
    });
  }
  await core.summary
    .addTable([
      [
        { data: 'Details', header: true },
        { data: 'Result', header: true },
      ],
      ['Coverage file', inputs.lcovFile],
      ['Coverage file exist', (!!rawCoverageReport).toString()],
      [
        'Coverage file entries',
        (result.covered + result.not_covered).toString(),
      ],
      ['Total Covered', result.covered.toString()],
      ['Total Uncovered', result.not_covered.toString()],
    ])
    .addRaw('', true)
    .addRaw(summary)
    .write();
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
    commentPr: getInputBoolValue('comment-on-pr'),
    title: getInputValue('title'),
    primary_color: getInputValue('pie-covered-color'),
    secondary_color: getInputValue('pie-not-covered-color'),
    debugLcov: getInputBoolValue('debug-lcov'),
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
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch {
    return undefined;
  }
}

if (require.main === module) {
  // Code to be executed only when the script is run directly
  main().catch(function (err) {
    console.log(err);
    core.setFailed(err.message);
  });
}
