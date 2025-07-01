import Mathematics from '@tiptap/extension-mathematics';

// 块级数学公式扩展
export const MathBlockExtension = Mathematics.extend({
  name: 'mathematicsBlock',
}).configure({
  regex: /\$\$((?=[\s\S]*(?:\\[a-zA-Z]+|[\^_=≠<>≤≥±×÷∑∏∫∂∇∞αβγδεζηθικλμνξοπρστυφχψω]|\{[^}]*\}|\\frac|\\begin|\\end|\\left|\\right|\\sum|\\int|\\prod|\\lim|\\sqrt|\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\zeta|\\eta|\\theta|\\iota|\\kappa|\\lambda|\\mu|\\nu|\\xi|\\omicron|\\pi|\\rho|\\sigma|\\tau|\\upsilon|\\phi|\\chi|\\psi|\\omega))[\s\S]+?)\$\$/g,
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
  shouldRender: (state, pos, node) => {
    const $pos = state.doc.resolve(pos)
    if (['codeBlock', 'code'].includes($pos.parent.type.name)) {
      return false;
    }
    let parent: any = $pos.parent
    while (parent) {
      if (['codeBlock', 'code'].includes(parent.type.name)) {
        return false;
      }
      parent = parent.parent;
    }
    return true
  },
});

// 内联数学公式扩展
export const MathInlineExtension = Mathematics.extend({
  name: 'mathematicsInline',
}).configure({
  regex: /(?<!\$)\$(?!\$)((?=.*(?:\\[a-zA-Z]+|[\^_=≠<>≤≥±×÷∑∏∫∂∇∞αβγδεζηθικλμνξοπρστυφχψω]|\{[^}]*\}))[^$\r\n]+?)\$(?!\$)/g,
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
  shouldRender: (state, pos, node) => {
    const $pos = state.doc.resolve(pos)
    return node.type.name === 'text' && $pos.parent.type.name !== 'codeBlock'
  },
});

// 默认导出块级扩展
const MathExtension = MathBlockExtension;
export default MathExtension; 