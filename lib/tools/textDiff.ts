export interface DiffOptions {
  mode: 'side-by-side' | 'inline' | 'unified';
  granularity: 'line' | 'word' | 'character';
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
  ignoreLeadingWhitespace?: boolean;
  ignoreTrailingWhitespace?: boolean;
  ignoreBlankLines?: boolean;
  showInvisibles?: boolean;
  contextLines?: number;
  syntaxHighlighting?: boolean;
  fileType?:
    | 'auto'
    | 'text'
    | 'json'
    | 'xml'
    | 'yaml'
    | 'sql'
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'java'
    | 'csharp'
    | 'cpp'
    | 'go'
    | 'rust'
    | 'php'
    | 'ruby'
    | 'swift';
}

export interface DiffResult {
  changes: DiffChange[];
  statistics: DiffStatistics;
  hunks?: DiffHunk[];
  patch?: string;
}

export interface DiffChange {
  type: 'add' | 'remove' | 'modify' | 'equal';
  lineNumber: {
    left?: number;
    right?: number;
  };
  content: {
    left?: string;
    right?: string;
  };
  subChanges?: SubChange[];
}

export interface SubChange {
  type: 'add' | 'remove' | 'equal';
  value: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

export interface DiffStatistics {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
  similarity: number;
}

// Preprocessing functions
export function preprocessText(text: string, options: DiffOptions): string {
  let processed = text;

  if (options.ignoreCase) {
    processed = processed.toLowerCase();
  }

  if (options.ignoreWhitespace) {
    processed = processed.replace(/\s+/g, '');
  } else if (options.ignoreLeadingWhitespace) {
    processed = processed.replace(/^\s+/gm, '');
  } else if (options.ignoreTrailingWhitespace) {
    processed = processed.replace(/\s+$/gm, '');
  }

  if (options.ignoreBlankLines) {
    processed = processed
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n');
  }

  return processed;
}

// LCS (Longest Common Subsequence) algorithm for line diff
export function computeLCS(lines1: string[], lines2: string[]): number[][] {
  const m = lines1.length;
  const n = lines2.length;
  const lcs: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  return lcs;
}

// Myers diff algorithm implementation
export function myersDiff(
  text1: string,
  text2: string,
  options: DiffOptions
): DiffChange[] {
  const lines1 = preprocessText(text1, options).split('\n');
  const lines2 = preprocessText(text2, options).split('\n');
  const lcs = computeLCS(lines1, lines2);
  const changes: DiffChange[] = [];

  let i = lines1.length;
  let j = lines2.length;
  let lineNum1 = lines1.length;
  let lineNum2 = lines2.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      // Lines are equal
      changes.unshift({
        type: 'equal',
        lineNumber: { left: lineNum1, right: lineNum2 },
        content: { left: lines1[i - 1], right: lines2[j - 1] },
      });
      i--;
      j--;
      lineNum1--;
      lineNum2--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Addition
      changes.unshift({
        type: 'add',
        lineNumber: { right: lineNum2 },
        content: { right: lines2[j - 1] },
      });
      j--;
      lineNum2--;
    } else {
      // Deletion
      changes.unshift({
        type: 'remove',
        lineNumber: { left: lineNum1 },
        content: { left: lines1[i - 1] },
      });
      i--;
      lineNum1--;
    }
  }

  // Detect modifications (remove followed by add)
  const processedChanges: DiffChange[] = [];
  for (let k = 0; k < changes.length; k++) {
    if (
      k < changes.length - 1 &&
      changes[k].type === 'remove' &&
      changes[k + 1].type === 'add'
    ) {
      // Combine into modification with word-level diff if requested
      const modChange: DiffChange = {
        type: 'modify',
        lineNumber: {
          left: changes[k].lineNumber.left,
          right: changes[k + 1].lineNumber.right,
        },
        content: {
          left: changes[k].content.left,
          right: changes[k + 1].content.right,
        },
      };

      if (
        options.granularity === 'word' ||
        options.granularity === 'character'
      ) {
        modChange.subChanges = computeSubChanges(
          changes[k].content.left!,
          changes[k + 1].content.right!,
          options.granularity
        );
      }

      processedChanges.push(modChange);
      k++; // Skip the next change as we've combined it
    } else {
      processedChanges.push(changes[k]);
    }
  }

  return processedChanges;
}

// Compute word or character level changes within a line
export function computeSubChanges(
  text1: string,
  text2: string,
  granularity: 'word' | 'character'
): SubChange[] {
  const subChanges: SubChange[] = [];

  if (granularity === 'word') {
    const words1 = text1.match(/\S+|\s+/g) || [];
    const words2 = text2.match(/\S+|\s+/g) || [];
    const wordLcs = computeLCS(words1, words2);

    let i = words1.length;
    let j = words2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
        subChanges.unshift({ type: 'equal', value: words1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || wordLcs[i][j - 1] >= wordLcs[i - 1][j])) {
        subChanges.unshift({ type: 'add', value: words2[j - 1] });
        j--;
      } else {
        subChanges.unshift({ type: 'remove', value: words1[i - 1] });
        i--;
      }
    }
  } else {
    // Character-level diff
    const chars1 = text1.split('');
    const chars2 = text2.split('');
    const charLcs = computeLCS(chars1, chars2);

    let i = chars1.length;
    let j = chars2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && chars1[i - 1] === chars2[j - 1]) {
        subChanges.unshift({ type: 'equal', value: chars1[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || charLcs[i][j - 1] >= charLcs[i - 1][j])) {
        subChanges.unshift({ type: 'add', value: chars2[j - 1] });
        j--;
      } else {
        subChanges.unshift({ type: 'remove', value: chars1[i - 1] });
        i--;
      }
    }
  }

  return subChanges;
}

// Calculate diff statistics
export function calculateStatistics(changes: DiffChange[]): DiffStatistics {
  const stats: DiffStatistics = {
    additions: 0,
    deletions: 0,
    modifications: 0,
    unchanged: 0,
    similarity: 0,
  };

  for (const change of changes) {
    switch (change.type) {
      case 'add':
        stats.additions++;
        break;
      case 'remove':
        stats.deletions++;
        break;
      case 'modify':
        stats.modifications++;
        break;
      case 'equal':
        stats.unchanged++;
        break;
    }
  }

  const total =
    stats.additions + stats.deletions + stats.modifications + stats.unchanged;
  if (total > 0) {
    stats.similarity = Math.round((stats.unchanged / total) * 100);
  }

  return stats;
}

// Generate unified diff format
export function generateUnifiedDiff(
  filename: string,
  text1: string,
  text2: string,
  options: DiffOptions
): string {
  const changes = myersDiff(text1, text2, options);
  const contextLines = options.contextLines || 3;
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');

  let patch = `--- ${filename}\n+++ ${filename}\n`;
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];

    if (change.type !== 'equal') {
      // Start a new hunk or continue current one
      if (!currentHunk) {
        currentHunk = {
          oldStart: Math.max(
            1,
            (change.lineNumber.left || change.lineNumber.right || 1) -
              contextLines
          ),
          oldLines: 0,
          newStart: Math.max(
            1,
            (change.lineNumber.right || change.lineNumber.left || 1) -
              contextLines
          ),
          newLines: 0,
          lines: [],
        };

        // Add context before
        for (let j = Math.max(0, i - contextLines); j < i; j++) {
          if (changes[j].type === 'equal') {
            currentHunk.lines.push(` ${changes[j].content.left}`);
            currentHunk.oldLines++;
            currentHunk.newLines++;
          }
        }
      }

      // Add the change
      if (change.type === 'remove') {
        currentHunk.lines.push(`-${change.content.left}`);
        currentHunk.oldLines++;
      } else if (change.type === 'add') {
        currentHunk.lines.push(`+${change.content.right}`);
        currentHunk.newLines++;
      } else if (change.type === 'modify') {
        currentHunk.lines.push(`-${change.content.left}`);
        currentHunk.lines.push(`+${change.content.right}`);
        currentHunk.oldLines++;
        currentHunk.newLines++;
      }

      // Check if we should close the hunk
      let hasMoreChanges = false;
      for (
        let j = i + 1;
        j <= i + contextLines * 2 + 1 && j < changes.length;
        j++
      ) {
        if (changes[j].type !== 'equal') {
          hasMoreChanges = true;
          break;
        }
      }

      if (!hasMoreChanges) {
        // Add context after
        for (let j = i + 1; j <= i + contextLines && j < changes.length; j++) {
          if (changes[j].type === 'equal') {
            currentHunk.lines.push(` ${changes[j].content.left}`);
            currentHunk.oldLines++;
            currentHunk.newLines++;
          }
        }

        hunks.push(currentHunk);
        currentHunk = null;
      }
    }
  }

  // Generate patch from hunks
  for (const hunk of hunks) {
    patch += `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;
    patch += hunk.lines.join('\n') + '\n';
  }

  return patch;
}

// Generate side-by-side HTML
export function generateSideBySideHTML(changes: DiffChange[]): string {
  let html = `
    <style>
      .diff-container { display: flex; font-family: monospace; font-size: 14px; }
      .diff-side { flex: 1; overflow-x: auto; }
      .diff-line { display: flex; min-height: 20px; }
      .line-number { width: 50px; text-align: right; padding-right: 10px; color: #666; background: #f5f5f5; user-select: none; }
      .line-content { flex: 1; padding-left: 10px; white-space: pre; }
      .add { background-color: #e6ffed; }
      .remove { background-color: #ffebe9; }
      .modify { background-color: #fff3cd; }
      .equal { background-color: white; }
      .sub-add { background-color: #acf2bd; }
      .sub-remove { background-color: #fdb8c0; }
    </style>
    <div class="diff-container">
      <div class="diff-side">
  `;

  // Left side
  for (const change of changes) {
    if (change.type === 'add') {
      html += `<div class="diff-line"><span class="line-number"></span><span class="line-content"></span></div>`;
    } else {
      const className =
        change.type === 'remove'
          ? 'remove'
          : change.type === 'modify'
            ? 'modify'
            : 'equal';
      html += `<div class="diff-line ${className}">`;
      html += `<span class="line-number">${change.lineNumber.left || ''}</span>`;
      html += `<span class="line-content">`;

      if (change.subChanges) {
        for (const sub of change.subChanges) {
          if (sub.type === 'remove') {
            html += `<span class="sub-remove">${escapeHtml(sub.value)}</span>`;
          } else if (sub.type === 'equal') {
            html += escapeHtml(sub.value);
          }
        }
      } else {
        html += escapeHtml(change.content.left || '');
      }

      html += `</span></div>`;
    }
  }

  html += `</div><div class="diff-side">`;

  // Right side
  for (const change of changes) {
    if (change.type === 'remove') {
      html += `<div class="diff-line"><span class="line-number"></span><span class="line-content"></span></div>`;
    } else {
      const className =
        change.type === 'add'
          ? 'add'
          : change.type === 'modify'
            ? 'modify'
            : 'equal';
      html += `<div class="diff-line ${className}">`;
      html += `<span class="line-number">${change.lineNumber.right || ''}</span>`;
      html += `<span class="line-content">`;

      if (change.subChanges) {
        for (const sub of change.subChanges) {
          if (sub.type === 'add') {
            html += `<span class="sub-add">${escapeHtml(sub.value)}</span>`;
          } else if (sub.type === 'equal') {
            html += escapeHtml(sub.value);
          }
        }
      } else {
        html += escapeHtml(change.content.right || '');
      }

      html += `</span></div>`;
    }
  }

  html += `</div></div>`;
  return html;
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Detect file type from content
export function detectFileType(content: string): string {
  const trimmed = content.trim();

  // JSON detection
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(content);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }

  // XML detection
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
    if (/<\/\w+>/.test(content)) {
      return 'xml';
    }
  }

  // SQL detection
  const sqlKeywords =
    /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|DATABASE)\b/i;
  if (sqlKeywords.test(content)) {
    return 'sql';
  }

  // JavaScript/TypeScript detection
  if (/\b(function|const|let|var|class|import|export|return)\b/.test(content)) {
    if (/\b(interface|type|enum|namespace|declare)\b/.test(content)) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Python detection
  if (/\b(def|class|import|from|if __name__|print)\b/.test(content)) {
    return 'python';
  }

  // Java detection
  if (
    /\b(public|private|class|interface|extends|implements|static void main)\b/.test(
      content
    )
  ) {
    return 'java';
  }

  // YAML detection
  if (/^[\s]*[\w]+:\s*[\w\s]+$/m.test(content)) {
    return 'yaml';
  }

  return 'text';
}

// Main diff function
export function computeDiff(
  text1: string,
  text2: string,
  options: DiffOptions = {
    mode: 'side-by-side',
    granularity: 'line',
  }
): DiffResult {
  const changes = myersDiff(text1, text2, options);
  const statistics = calculateStatistics(changes);

  const result: DiffResult = {
    changes,
    statistics,
  };

  if (options.mode === 'unified') {
    result.patch = generateUnifiedDiff('file.txt', text1, text2, options);
  }

  return result;
}
