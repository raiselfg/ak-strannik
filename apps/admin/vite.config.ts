import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

function getApiOrigin(mode: string) {
  const apiOrigin = loadEnv(mode, process.cwd(), '').ADMIN_DEV_API_ORIGIN;

  if (!apiOrigin) {
    throw new Error(
      'ADMIN_DEV_API_ORIGIN is required when serving the admin application'
    );
  }

  const url = new URL(apiOrigin);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('ADMIN_DEV_API_ORIGIN must use http or https');
  }

  return url.origin;
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const apiOrigin =
    command === 'serve' && mode !== 'test' ? getApiOrigin(mode) : undefined;

  return {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: apiOrigin
      ? {
          proxy: {
            '/api': {
              target: apiOrigin,
              changeOrigin: true,
              secure: true,
              cookieDomainRewrite: '',
            },
          },
        }
      : undefined,
    plugins: [
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
  };
});
