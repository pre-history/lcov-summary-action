interface Options {
  title?: string;
  primary_color?: string;
  secondary_color?: string;
}

export function generateSummary(
  covered: number,
  not_covered: number,
  options?: Options,
): string {
  const primary = options?.primary_color || '#4CAF50';
  const secondary = options?.secondary_color || '#FF5733';
  const title = options?.title || 'Project Coverage';
  return `\`\`\`mermaid
  %%{init: {'theme': 'base', 'themeVariables': {'darkMode': { 'primaryTextColor': '#fff'  }, 'primaryColor': '${covered >= not_covered ? primary : secondary}', 'secondaryColor': '${covered < not_covered ? primary : secondary}',  'primaryTextColor': '#000' }}}%%
    pie showData
    title ${title}
    "Covered" : ${covered}
    "Not covered" : ${not_covered}
\`\`\``;
}
