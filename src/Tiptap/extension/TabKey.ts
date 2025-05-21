import { Extension, type Editor } from '@tiptap/core';

const TabKeyExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }: { editor: Editor }) => {
        window.event?.preventDefault()
        if (editor.isActive('codeBlock')) {
          editor.commands.insertContent('\t')
          return true
        }
        if (editor.can().sinkListItem('listItem')) {
          editor.commands.sinkListItem('listItem')
          return true
        }
        editor.commands.insertContent('\t')
        return true
      },
      'Shift-Tab': ({ editor }: { editor: Editor }) => {
        window.event?.preventDefault()
        if (editor.can().liftListItem('listItem')) {
          editor.commands.liftListItem('listItem')
          return true
        }
        return false
      }
    }
  }
})

export default TabKeyExtension;