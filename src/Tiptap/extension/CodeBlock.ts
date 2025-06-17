import { mergeAttributes } from '@tiptap/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Plugin } from 'prosemirror-state'

export const CodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-code-block': {
        default: true,
        rendered: true,
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        class: 'code-block-wrapper',
        'data-code-block-wrapper': 'true'
      },
      [
        'button',
        {
          class: 'copy-button',
          title: '复制代码',
          type: 'button',
          'data-testid': 'copy-button',
        },
        '复制'
      ],
      [
        'pre',
        mergeAttributes(HTMLAttributes, { 'data-code-block': 'true' }),
        ['code', {}, 0]
      ]
    ]
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || []

    return [
      ...plugins,
      new Plugin({
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement
              if (target.matches('.copy-button')) {
                event.preventDefault()
                event.stopPropagation()

                const wrapper = target.closest('.code-block-wrapper')
                const pre = wrapper?.querySelector('pre')
                if (pre) {
                  const code = pre.textContent || ''
                  try {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(code).then(() => {
                        target.textContent = '已复制!'
                        setTimeout(() => {
                          target.textContent = '复制'
                        }, 2000)
                      })
                    }
                  } catch (error) {
                    console.error('复制失败:', error)
                  }
                }
                return true
              }
              return false
            }
          }
        }
      })
    ]
  }
}) 