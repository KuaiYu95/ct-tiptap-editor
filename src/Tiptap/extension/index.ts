import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Heading from '@tiptap/extension-heading';
import Highlight from "@tiptap/extension-highlight";
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
  ResizableImage,
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: 1024 * 1024 * (upload?.size || 20),
    limit: 1,
    upload: upload?.onUpload,
    onError: onError,
    onSuccess: (url) => console.log('Image upload success:', url),
  }),
  Video,
  ResizableVideo,
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
  }),
  TableRow,
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
      };
    },
  }),
  TableHeader,
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
  }),
]);

export default extensions;