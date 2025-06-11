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
    return ["video", mergeAttributes(HTMLAttributes, {
      controls: true,
      autoplay: false,
      loop: false,
      muted: false,
      playsinline: true,
      style: {
        width: '100%',
        height: 'auto',
      },
    })]
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          },
    }
  },
})

export default Video 