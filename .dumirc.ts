import { Mark } from '@tiptap/core';
import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'ct-tiptap-editor',
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