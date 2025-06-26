import { mergeAttributes, Node } from "@tiptap/react";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; alt?: string; title?: string }) => ReturnType
    }
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",

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
    const styleObject: Record<string, string> = {};

    if (width) styleObject.width = `${width}px`;
    if (height) styleObject.height = `${height}px`;

    if (!width && !height) {
      styleObject.width = '100%';
      styleObject.height = 'auto';
    }

    // 将样式对象转换为CSS字符串
    const style = Object.entries(styleObject)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    return ["video", mergeAttributes(otherAttrs, {
      style,
      controls: true,
      loop: false,
      muted: false,
      playsinline: true,
      width: width || undefined,
      height: height || undefined
    })]
  },

  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

export default Video 