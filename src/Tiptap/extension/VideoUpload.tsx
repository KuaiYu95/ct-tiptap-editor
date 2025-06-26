import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"
import { VideoUploadNode as VideoUploadNodeComponent } from "../component/VideoUploadNode"

export type UploadFunction = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

export interface VideoUploadNodeOptions {
  /**
   * Acceptable file types for upload.
   * @default 'video/*'
   */
  accept?: string
  /**
   * Maximum number of files that can be uploaded.
   * @default 1
   */
  limit?: number
  /**
   * Maximum file size in bytes (0 for unlimited).
   * @default 0
   */
  maxSize?: number
  /**
   * Function to handle the upload process.
   */
  upload?: UploadFunction
  /**
   * Callback for upload errors.
   */
  onError?: (error: Error) => void
  /**
   * Callback for successful uploads.
   */
  onSuccess?: (url: string) => void
  /**
   * Pending file to upload (used when file is dropped externally)
   */
  pendingFile?: File
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    videoUpload: {
      setVideoUploadNode: (options?: VideoUploadNodeOptions) => ReturnType
    }
  }
}

/**
 * A TipTap node extension that creates an video upload component.
 * @see registry/tiptap-node/video-upload-node/video-upload-node
 */
export const VideoUploadNode = Node.create<VideoUploadNodeOptions>({
  name: "videoUpload",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      accept: "video/*",
      limit: 1,
      maxSize: 0,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
    }
  },

  addAttributes() {
    return {
      accept: {
        default: this.options.accept,
      },
      limit: {
        default: this.options.limit,
      },
      maxSize: {
        default: this.options.maxSize,
      },
      pendingFile: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-upload"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "video-upload" }, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeComponent)
  },

  addCommands() {
    return {
      setVideoUploadNode:
        (options = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          },
    }
  },

  /**
   * Adds Enter key handler to trigger the upload component when it's selected.
   */
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state
        const { nodeAfter } = selection.$from

        if (
          nodeAfter &&
          nodeAfter.type.name === "videoUpload" &&
          editor.isActive("videoUpload")
        ) {
          const nodeEl = editor.view.nodeDOM(selection.$from.pos)
          if (nodeEl && nodeEl instanceof HTMLElement) {
            // Since NodeViewWrapper is wrapped with a div, we need to click the first child
            const firstChild = nodeEl.firstChild
            if (firstChild && firstChild instanceof HTMLElement) {
              firstChild.click()
              return true
            }
          }
        }
        return false
      },
    }
  },
})

export default VideoUploadNode