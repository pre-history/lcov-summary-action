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
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) linesHit += value;
    } else if (line.startsWith('LF:')) {
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) totalLines += value;
    }
  });

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
