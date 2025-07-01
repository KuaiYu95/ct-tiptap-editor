import Mathematics from '@tiptap/extension-mathematics';

// 块级数学公式扩展
export const MathBlockExtension = Mathematics.extend({
  name: 'mathematicsBlock',

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'Tiptap-mathematics-render Tiptap-mathematics-render--block',
        renderHTML: (attributes: any) => ({
          class: attributes.class,
        }),
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
      },
    }
  },
}).configure({
  regex: /\$\$([\s\S]+?)\$\$/g,
  katexOptions: {
    throwOnError: false,
    displayMode: true,
    output: 'html' as const,
    strict: false,
    macros: {
      "\\RR": "\\mathbb{R}",
      "\\NN": "\\mathbb{N}",
      "\\ZZ": "\\mathbb{Z}",
      "\\QQ": "\\mathbb{Q}",
      "\\CC": "\\mathbb{C}",
    },
  },
  shouldRender: () => true,
});

// 内联数学公式扩展
export const MathInlineExtension = Mathematics.extend({
  name: 'mathematicsInline',

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'Tiptap-mathematics-render Tiptap-mathematics-render--inline',
        renderHTML: (attributes: any) => ({
          class: attributes.class,
        }),
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
      },
    }
  },
}).configure({
  regex: /(?<!\$)\$(?!\$)([^$\r\n]+?)\$(?!\$)/g,
  katexOptions: {
    throwOnError: false,
    displayMode: false,
    output: 'html' as const,
    strict: false,
    macros: {
      "\\RR": "\\mathbb{R}",
      "\\NN": "\\mathbb{N}",
      "\\ZZ": "\\mathbb{Z}",
      "\\QQ": "\\mathbb{Q}",
      "\\CC": "\\mathbb{C}",
    },
  },
  shouldRender: () => true,
});

// 默认导出块级扩展
const MathExtension = MathBlockExtension;
export default MathExtension; 