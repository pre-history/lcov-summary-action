/**
 * Represents coverage data for a single file.
 */
export interface FileCoverage {
  filename: string;
  covered: number;
  total: number;
  percentage: number;
  branches_covered?: number;
  branches_total?: number;
  functions_covered?: number;
  functions_total?: number;
}

/**
 * Represents the parsed LCOV summary.
 */
export interface ParseLcov {
  covered: number;
  not_covered: number;
  percentage: number;
  files: FileCoverage[];
  total_files: number;
}

/**
 * Represents coverage comparison between two LCOV results.
 */
export interface CoverageDiff {
  covered_diff: number;
  percentage_diff: number;
  files_changed: FileChange[];
  new_files: FileCoverage[];
  removed_files: FileCoverage[];
}

export interface FileChange {
  filename: string;
  base_coverage: number;
  current_coverage: number;
  coverage_diff: number;
  lines_diff: number;
}

/**
 * Parses an LCOV report string and returns coverage summary.
 * Handles multiple sections and validates input.
 */
export function parseLcov(lcov: string): ParseLcov {
  const lcovLines = lcov.split('\n');
  const files: FileCoverage[] = [];

  let totalLinesHit = 0;
  let totalLines = 0;

  // Current file being processed
  let currentFile: Partial<FileCoverage> = {};

  for (const line of lcovLines) {
    if (line.startsWith('SF:')) {
      // Source file - start new file
      const filename = line.substring(3).trim();
      currentFile = { filename, covered: 0, total: 0, percentage: 0 };
    } else if (line.startsWith('LH:')) {
      // Lines hit
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.covered = value;
      }
    } else if (line.startsWith('LF:')) {
      // Lines found (total)
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.total = value;
      }
    } else if (line.startsWith('BRH:')) {
      // Branches hit
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.branches_covered = value;
      }
    } else if (line.startsWith('BRF:')) {
      // Branches found (total)
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.branches_total = value;
      }
    } else if (line.startsWith('FNH:')) {
      // Functions hit
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.functions_covered = value;
      }
    } else if (line.startsWith('FNF:')) {
      // Functions found (total)
      const value = parseInt(line.split(':')[1], 10);
      if (!isNaN(value)) {
        currentFile.functions_total = value;
      }
    } else if (line.trim() === 'end_of_record') {
      // End of current file record
      if (
        currentFile.filename &&
        currentFile.total !== undefined &&
        currentFile.covered !== undefined
      ) {
        // Calculate percentage for this file
        currentFile.percentage =
          currentFile.total > 0
            ? Number(
                ((currentFile.covered / currentFile.total) * 100).toFixed(2),
              )
            : 0;

        files.push(currentFile as FileCoverage);

        // Add to totals
        totalLinesHit += currentFile.covered;
        totalLines += currentFile.total;
      }
      currentFile = {};
    }
  }

  // Handle case where file does not end with end_of_record
  if (currentFile.filename && (currentFile.total || 0) > 0) {
    const covered = currentFile.covered || 0;
    const total = currentFile.total || 1;
    currentFile.percentage =
      total > 0 ? Number(((covered / total) * 100).toFixed(2)) : 0;

    files.push(currentFile as FileCoverage);
    totalLinesHit += covered;
    totalLines += currentFile.total || 0;
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

/**
 * Compares two LCOV results and returns the difference.
 */
export function compareLcov(
  current: ParseLcov,
  base?: ParseLcov,
): CoverageDiff | null {
  if (!base) return null;

  const covered_diff = current.covered - base.covered;
  const percentage_diff = Number(
    (current.percentage - base.percentage).toFixed(2),
  );

  // Create maps for easier lookup
  const baseFileMap = new Map(base.files.map((f) => [f.filename, f]));
  const currentFileMap = new Map(current.files.map((f) => [f.filename, f]));

  const files_changed: FileChange[] = [];
  const new_files: FileCoverage[] = [];
  const removed_files: FileCoverage[] = [];

  // Find changed and new files
  for (const currentFile of current.files) {
    const baseFile = baseFileMap.get(currentFile.filename);
    if (baseFile) {
      // File exists in both - check for changes
      if (Math.abs(currentFile.percentage - baseFile.percentage) > 0.01) {
        files_changed.push({
          filename: currentFile.filename,
          base_coverage: baseFile.percentage,
          current_coverage: currentFile.percentage,
          coverage_diff: Number(
            (currentFile.percentage - baseFile.percentage).toFixed(2),
          ),
          lines_diff: currentFile.covered - baseFile.covered,
        });
      }
    } else {
      // New file
      new_files.push(currentFile);
    }
  }

  // Find removed files
  for (const baseFile of base.files) {
    if (!currentFileMap.has(baseFile.filename)) {
      removed_files.push(baseFile);
    }
  }

  return {
    covered_diff,
    percentage_diff,
    files_changed,
    new_files,
    removed_files,
  };
}
