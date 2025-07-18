import { mergeAttributes, Node } from "@tiptap/react";

export interface VideoExtensionOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    videoExtension: {
      setVideo: (options: { src: string; alt?: string; title?: string }) => ReturnType
    }
  }
}

export const VideoExtension = Node.create<VideoExtensionOptions>({
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
          // 优先从width属性读取
          const width = element.getAttribute('width')
          if (width) return parseInt(width)

          // 其次从style中读取
          const style = element.getAttribute('style')
          if (style) {
            const widthMatch = style.match(/width:\s*(\d+)px/)
            if (widthMatch) return parseInt(widthMatch[1])
          }

          return null
        },
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          // 优先从height属性读取
          const height = element.getAttribute('height')
          if (height) return parseInt(height)

          // 其次从style中读取
          const style = element.getAttribute('style')
          if (style) {
            const heightMatch = style.match(/height:\s*(\d+)px/)
            if (heightMatch) return parseInt(heightMatch[1])
          }

          return null
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

export default VideoExtension 