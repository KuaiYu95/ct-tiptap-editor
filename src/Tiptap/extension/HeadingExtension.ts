import Heading from '@tiptap/extension-heading';

const HeadingExtension = Heading.configure({
  levels: [1, 2, 3, 4, 5, 6],
  HTMLAttributes: {
    class: 'heading',
  },
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => ({ id: attributes.id })
      },
    }
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setHeading: (attributes: any) => ({ commands }) => {
        const attrs = { ...attributes };
        if (!attrs.id) {
          attrs.id = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        }
        return commands.setNode(this.name, attrs);
      },
      toggleHeading: (attributes: any) => ({ commands }) => {
        const attrs = { ...attributes };
        if (!attrs.id) {
          attrs.id = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        }
        return commands.toggleNode(this.name, 'paragraph', attrs);
      },
    }
  },
});

export default HeadingExtension; 