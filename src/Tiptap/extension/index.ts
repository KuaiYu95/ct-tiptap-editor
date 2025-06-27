import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Heading from '@tiptap/extension-heading';
import Highlight from "@tiptap/extension-highlight";
import Image from '@tiptap/extension-image';
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from '@tiptap/extension-text-style';
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { StarterKit } from "@tiptap/starter-kit";
import { all, createLowlight } from 'lowlight';
import { Markdown } from 'tiptap-markdown';
import { CodeBlock } from './CodeBlock';
import FontSize from "./FontSize";
import ImageUploadNode from './ImageUpload';
import Link from "./Link";
import ResizableImage from './ResizableImage';
import ResizableVideo from './ResizableVideo';
import Selection from "./Selection";
import TabKeyExtension from "./TabKey";
import TrailingNode from "./TrailingNode";
import Video from './Video';
import VideoUploadNode, { UploadFunction } from './VideoUpload';

type UploadOptions = {
  size?: number,
  onUpload?: UploadFunction,
}

const lowlight = createLowlight(all)

const extensions = (
  {
    editable,
    upload, onError
  }: {
    editable?: boolean,
    upload?: UploadOptions,
    onError?: (error: Error) => void
  }
) => ([
  StarterKit.configure({
    codeBlock: false,
    heading: false,
  }),
  Markdown.configure({
    html: true,
    breaks: true,
    transformPastedText: true,
  }),
  Color,
  Underline,
  TextStyle,
  TaskList,
  // 在编辑模式下使用可调整大小的图片，在只读模式下使用普通图片
  ...(editable ? [
    ResizableImage,
  ] : [
    Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
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
      renderHTML({ HTMLAttributes }) {
        const { width, height, ...otherAttrs } = HTMLAttributes;
        const styleObject: Record<string, string> = {};

        if (width) styleObject.width = `${width}px`;
        if (height) styleObject.height = `${height}px`;

        if (!width && !height) {
          styleObject.width = '100%';
          styleObject.height = 'auto';
        }

        const style = Object.entries(styleObject)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');

        return ["img", {
          ...otherAttrs,
          style: style || undefined,
          width: width || undefined,
          height: height || undefined
        }]
      },
    }),
  ]),
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: 1024 * 1024 * (upload?.size || 20),
    limit: 1,
    upload: upload?.onUpload,
    onError: onError,
    onSuccess: (url) => console.log('Image upload success:', url),
  }),
  // 在编辑模式下使用可调整大小的视频，在只读模式下使用普通视频
  ...(editable ? [
    ResizableVideo,
  ] : [
    Video,
  ]),
  VideoUploadNode.configure({
    accept: 'video/*',
    maxSize: 1024 * 1024 * (upload?.size || 20),
    limit: 1,
    upload: upload?.onUpload,
    onError: onError,
    onSuccess: (url) => console.log('Video upload success:', url),
  }),
  Typography,
  Table.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 25,
    lastColumnResizable: false,
    HTMLAttributes: {
      class: 'editor-table',
    },
  }).extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: 'editor-table',
          parseHTML: element => element.getAttribute('class'),
          renderHTML: attributes => ({
            class: attributes.class,
          }),
        },
      };
    },

  }),
  TableRow.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: null,
          parseHTML: element => element.getAttribute('class'),
          renderHTML: attributes => ({
            class: attributes.class,
          }),
        },
      };
    },
  }),
  TableCell.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        style: {
          default: null,
          parseHTML: element => element.getAttribute('style'),
          renderHTML: attributes => ({
            style: attributes.style,
          }),
        },
        class: {
          default: null,
          parseHTML: element => element.getAttribute('class'),
          renderHTML: attributes => ({
            class: attributes.class,
          }),
        },
      };
    },
  }),
  TableHeader.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: null,
          parseHTML: element => element.getAttribute('class'),
          renderHTML: attributes => ({
            class: attributes.class,
          }),
        },
      };
    },
  }),
  Superscript,
  Subscript,
  Selection,
  TrailingNode,
  FontSize,
  TabKeyExtension,
  ...(!editable ? [CodeBlock.configure({
    lowlight,
  })] : [CodeBlockLowlight.configure({
    lowlight,
  })]),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ['left', 'center', 'right', 'justify']
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: '_self'
    }
  }),
  TaskItem.configure({ nested: true }),
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'highlight-marker'
    }
  }),
  Heading.configure({
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
  }),
]);

export default extensions;