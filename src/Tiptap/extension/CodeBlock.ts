import { mergeAttributes } from '@tiptap/core'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

export const CodeBlock = CodeBlockLowlight.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'code-block-wrapper' },
      [
        'button',
        {
          class: 'copy-button',
          title: '复制代码',
          'data-testid': 'copy-button',
          onClick: (event: MouseEvent) => {
            event.preventDefault()
            event.stopPropagation()
            const pre = (event.target as HTMLElement).closest('.code-block-wrapper')?.querySelector('pre')
            if (pre) {
              const code = pre.textContent || ''
              navigator.clipboard.writeText(code).then(() => {
                const button = event.target as HTMLElement
                button.textContent = '已复制!'
                setTimeout(() => {
                  button.textContent = '复制'
                }, 2000)
              })
            }
          },
        },
        '复制'
      ],
      [
        'pre',
        mergeAttributes(HTMLAttributes),
        ['code', {}, 0]
      ]
    ]
  }
}) 