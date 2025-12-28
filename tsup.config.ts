import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    'src/*.ts',
    'src/well-known/*.ts',
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  target: 'es2020',
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
});
