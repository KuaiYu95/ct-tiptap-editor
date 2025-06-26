import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageNode } from "../component/ResizableImageNode";

export interface ResizableImageOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
      }) => ReturnType
    }
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: "resizableImage",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width) : null
        },
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height) : null
        },
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "img",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, ...otherAttrs } = HTMLAttributes;
    const style: Record<string, any> = {};

    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;

    if (!width && !height) {
      style.width = '100%';
      style.height = 'auto';
    }

    return ["img", mergeAttributes(otherAttrs, style)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode)
  },

  addCommands() {
    return {
      setResizableImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

export default ResizableImage 