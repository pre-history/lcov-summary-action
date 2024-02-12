interface ParseLcov {
  covered: number;
  not_covered: number;
  percentage: number;
}

export function parseLcov(lcov: string): ParseLcov {
  const lcovLines = lcov.split('\n');

  let linesHit = 0;
  let totalLines = 0;

  lcovLines.forEach((line) => {
    if (line.startsWith('LH:')) {
      linesHit += parseInt(line.split(':')[1]);
    } else if (line.startsWith('LF:')) {
      totalLines += parseInt(line.split(':')[1]);
    }
  });

  let coveragePercentage = 0;
  if (totalLines > 0) {
    coveragePercentage = (linesHit / totalLines) * 100;
  }

  return {
    covered: linesHit,
    not_covered: totalLines - linesHit,
    percentage: coveragePercentage,
  };
}
