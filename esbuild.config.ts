import { build } from 'esbuild';

export default build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  target: 'node20',
});
