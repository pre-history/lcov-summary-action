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

export function parseLcovFiles(
  lcov: string,
): Record<string, { lh: number; lf: number }> {
  const lcovLines = lcov.split('\n');

  const files: Record<string, { lh: number; lf: number }> = {};
  let current = '';
  lcovLines.forEach((line) => {
    if (line.startsWith('SF:')) {
      current = line.split(':')[1];
    } else if (line.startsWith('LH:')) {
      files[current] = { lh: parseInt(line.split(':')[1]), lf: 0 };
    } else if (line.startsWith('LF:')) {
      files[current] = { ...files[current], lf: parseInt(line.split(':')[1]) };
    }
  });

  return files;
}
