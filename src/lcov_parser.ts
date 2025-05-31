/**
 * Represents the parsed LCOV summary.
 */
interface ParseLcov {
  covered: number;
  not_covered: number;
  percentage: number;
}

/**
 * Parses an LCOV report string and returns coverage summary.
 * Handles multiple sections and validates input.
 */
export function parseLcov(lcov: string): ParseLcov {
  const lcovLines = lcov.split('\n');

  let linesHit = 0;
  let totalLines = 0;

  let sectionLinesHit = 0;
  let sectionTotalLines = 0;

  for (const line of lcovLines) {
    if (line.startsWith('LH:')) {
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) sectionLinesHit = value;
    } else if (line.startsWith('LF:')) {
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) sectionTotalLines = value;
    } else if (line.trim() === 'end_of_record') {
      linesHit += sectionLinesHit;
      totalLines += sectionTotalLines;
      sectionLinesHit = 0;
      sectionTotalLines = 0;
    }
  }

  // Handle case where file does not end with end_of_record
  if (sectionTotalLines > 0 || sectionLinesHit > 0) {
    linesHit += sectionLinesHit;
    totalLines += sectionTotalLines;
  }

  let coveragePercentage = 0;
  if (totalLines > 0) {
    coveragePercentage = Number(((linesHit / totalLines) * 100).toFixed(2));
  }

  return {
    covered: linesHit,
    not_covered: totalLines - linesHit,
    percentage: coveragePercentage,
  };
}
