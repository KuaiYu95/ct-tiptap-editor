import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableVideoNode } from "../component/ResizableVideoNode";

export interface ResizableVideoOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    resizableVideo: {
      setResizableVideo: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
      }) => ReturnType
    }
  }
}

export const ResizableVideo = Node.create<ResizableVideoOptions>({
  name: "resizableVideo",

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
        tag: "video",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, ...otherAttrs } = HTMLAttributes;
    const style: Record<string, any> = {
      controls: true,
      loop: false,
      muted: false,
      playsinline: true,
    };

    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;

    if (!width && !height) {
      style.width = '100%';
      style.height = 'auto';
    }

    return ["video", mergeAttributes(otherAttrs, style)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableVideoNode)
  },

  addCommands() {
    return {
      setResizableVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

export default ResizableVideo 