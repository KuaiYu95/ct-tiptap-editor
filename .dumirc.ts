import { Mark } from '@tiptap/core';
import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'ct-tiptap-editor',
  },
  proxy: {
    '/api/v1/creation/text': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      ws: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['connection'] = 'keep-alive';
        proxyRes.headers['cache-control'] = 'no-cache';
        proxyRes.headers['content-type'] = 'text/event-stream';
        proxyRes.headers['x-accel-buffering'] = 'no';
        proxyRes.headers['transfer-encoding'] = 'chunked';
      }
    },
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mark: {
      removeMark: (
        type: string | Mark,
        options?: {
          extendEmptyMarkRange?: boolean
        }
      ) => ReturnType
    },
    fontSize: {
      setFontSize: (size: number) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}