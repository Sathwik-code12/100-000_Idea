import esbuild from 'esbuild';
import TsconfigPathsPlugin from '@esbuild-plugins/tsconfig-paths';

esbuild.build({
  entryPoints: ['server/index.ts'],
  platform: 'node',
  packages: 'external',
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  plugins: [TsconfigPathsPlugin.default({ tsconfig: './tsconfig.json' })],
}).catch(() => process.exit(1));