import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base path so assets load seamlessly on GitHub Pages & custom domains
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
