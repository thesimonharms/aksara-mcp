import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  noExternal: ['aksara-ts'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});