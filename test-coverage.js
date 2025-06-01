#!/usr/bin/env bun

// Test our coverage parsing capabilities
const fs = require('fs');

// Simple LCOV parser for testing
function parseLcov(lcov) {
  const lcovLines = lcov.split('\n');
  const files = [];

  let totalLinesHit = 0;
  let totalLines = 0;
  let currentFile = {};

  for (const line of lcovLines) {
    if (line.startsWith('SF:')) {
      const filename = line.substring(3).trim();
      currentFile = { filename, covered: 0, total: 0, percentage: 0 };
    } else if (line.startsWith('LH:')) {
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.covered = value;
      }
    } else if (line.startsWith('LF:')) {
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.total = value;
      }
    } else if (line.trim() === 'end_of_record') {
      if (
        currentFile.filename &&
        currentFile.total !== undefined &&
        currentFile.covered !== undefined
      ) {
        currentFile.percentage =
          currentFile.total > 0
            ? Number(
                ((currentFile.covered / currentFile.total) * 100).toFixed(2),
              )
            : 0;

        files.push(currentFile);
        totalLinesHit += currentFile.covered;
        totalLines += currentFile.total;
      }
      currentFile = {};
    }
  }

  let coveragePercentage = 0;
  if (totalLines > 0) {
    coveragePercentage = Number(
      ((totalLinesHit / totalLines) * 100).toFixed(2),
    );
  }

  return {
    covered: totalLinesHit,
    not_covered: totalLines - totalLinesHit,
    percentage: coveragePercentage,
    files: files,
    total_files: files.length,
  };
}

// Test our parser with our own coverage
const lcovContent = fs.readFileSync('./coverage/lcov.info', 'utf8');
const result = parseLcov(lcovContent);

console.log('🦕 LCovMan Self-Test Results:');
console.log(`📊 Coverage: ${result.percentage}%`);
console.log(`📁 Files: ${result.total_files}`);
console.log(`✅ Covered Lines: ${result.covered}`);
console.log(`❌ Uncovered Lines: ${result.not_covered}`);

// Test badge generation
function generateCoverageBadge(percentage, style = 'flat') {
  let color = 'red';
  if (percentage >= 80) color = 'brightgreen';
  else if (percentage >= 60) color = 'yellow';
  else if (percentage >= 40) color = 'orange';

  const percentageText = `${percentage}%25`;
  const url = `https://img.shields.io/badge/coverage-${percentageText}-${color}?style=${style}`;
  const markdown = `![Coverage](${url})`;

  return { url, markdown };
}

const badge = generateCoverageBadge(result.percentage, 'for-the-badge');
console.log(`\n📋 Badge Markdown: ${badge.markdown}`);
console.log(`🔗 Badge URL: ${badge.url}`);

// Show detailed file breakdown
if (result.files.length > 0) {
  console.log('\n📂 File Breakdown:');
  result.files.forEach((file) => {
    const status =
      file.percentage >= 80 ? '✅' : file.percentage >= 50 ? '⚠️' : '❌';
    console.log(
      `  ${status} ${file.filename}: ${file.percentage}% (${file.covered}/${file.total})`,
    );
  });
}
