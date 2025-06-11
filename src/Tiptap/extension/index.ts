import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from "@tiptap/extension-image";
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
import FontSize from "./FontSize";
import Link from "./Link";
import Selection from "./Selection";
import TabKeyExtension from "./TabKey";
import TrailingNode from "./TrailingNode";
import Video from './Video';
import VideoUploadNode, { UploadFunction } from './VideoUpload';

const lowlight = createLowlight(all)
const extensions = (onUpload?: UploadFunction, onError?: (error: Error) => void) => ([
  StarterKit,
  HardBreak,
  HorizontalRule,
  Gapcursor,
  Dropcursor,
  Markdown,
  Color,
  Underline,
  TextStyle,
  TaskList,
  Image.configure({
    allowBase64: true,
    inline: true,
  }),
  Video,
  VideoUploadNode.configure({
    accept: 'video/*',
    maxSize: 1024 * 1024 * 10,
    limit: 1,
    upload: onUpload,
    onError: onError,
    onSuccess: (url) => console.log('Upload success:', url),
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
  CodeBlockLowlight.configure({
    lowlight,
  }),
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
    HTMLAttributes: {
      class: 'heading',
    },
  }).extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        id: {
          default: null,
        },
      }
    },
  }),
])

export default extensions;