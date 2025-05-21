import { Extension, type Command } from '@tiptap/core';

// 扩展 Tiptap 类型声明
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: number) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

// 修复后的字体扩展
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => parseInt(element.style.fontSize) || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: number): Command =>
          ({ chain }) => {
            return chain()
              .setMark('textStyle', { fontSize: size })
              .run();
          },

      unsetFontSize:
        (): Command =>
          ({ chain }) => {
            return chain()
              .setMark('textStyle', { fontSize: null })
              .removeMark('textStyle')
              .run();
          },
    };
  },
});

export default FontSize;
