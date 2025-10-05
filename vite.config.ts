import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ['src/sdk/**/*', 'src/components/**/*', 'src/types/**/*', 'src/utils/**/*'],
          exclude: ['src/main.tsx', 'src/App.tsx', 'src/vite-env.d.ts']
        })
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/sdk/index.ts'),
          name: 'VideoAdPlayerSDK',
          fileName: 'index',
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
          output: {
            exports: 'named',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'lucide-react': 'LucideReact',
            },
          },
        },
        outDir: 'dist',
        sourcemap: true,
        minify: false,
      },
    };
  }

  if (mode === 'vanilla') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/vanilla/index.js'),
          name: 'VideoAdPlayerVanilla',
          fileName: 'vanilla',
          formats: ['iife'],
        },
        outDir: 'dist',
        sourcemap: true,
        minify: true,
      },
    };
  }

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
