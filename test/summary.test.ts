// node test runner
import { describe, it } from 'node:test';
import assert from 'node:assert';

import { generateSummary } from '../src/summary';

describe('summary diagram generator', () => {
  it('should return the summary diagram', () => {
    const covered = 50;
    const not_covered = 50;
    const expected = `\`\`\`mermaid
  %%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#4CAF50', 'secondaryColor': '#FF5733',  'primaryTextColor': '#000', 'darkMode': { 'primaryTextColor': '#fff'  } }}}%%
    pie showData
    title Project Coverage
    "Covered" : ${covered}
    "Not covered" : ${not_covered}
\`\`\``;
    assert.equal(generateSummary(covered, not_covered), expected);
  });

  it('should return the summary diagram with custom Options', () => {
    const covered = 20;
    const not_covered = 80;
    const primary_color = '#1342a8';
    const secondary_color = '#ce650b';
    const title = 'Test Coverage';
    const expected = `\`\`\`mermaid
  %%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '${secondary_color}', 'secondaryColor': '${primary_color}',  'primaryTextColor': '#000', 'darkMode': { 'primaryTextColor': '#fff'  } }}}%%
    pie showData
    title ${title}
    "Covered" : ${covered}
    "Not covered" : ${not_covered}
\`\`\``;
    console.log(
      generateSummary(covered, not_covered, {
        secondary_color,
        primary_color,
        title,
      }),
    );
    assert.equal(
      generateSummary(covered, not_covered, {
        secondary_color,
        primary_color,
        title,
      }),
      expected,
    );
  });
});
