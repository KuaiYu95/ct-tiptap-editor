import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from '@tiptap/extension-table';
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
import CodeBlockExtension from './CodeBlockExtension';
import FontSizeExtension from './FontSizeExtension';
import HeadingExtension from './HeadingExtension';
import ImageExtension from './ImageExtension';
import ImageUploadExtension from './ImageUploadExtension';
import LinkExtension from './LinkExtension';
import ResizableImageExtension from './ResizableImageExtension';
import ResizableVideoExtension from './ResizableVideoExtension';
import SelectionExtension from './SelectionExtension';
import TabExtension from './TabExtension';
import TableCellExtension from './TableCellExtension';
import TrailingNodeExtension from './TrailingNodeExtension';
import VideoExtension from './VideoExtension';
import VideoUploadExtension, { UploadFunction } from './VideoUploadExtension';

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
  // ========== 基础扩展 ==========
  StarterKit.configure({
    codeBlock: false,
    heading: false,
  }),
  Markdown.configure({
    html: true,
    breaks: true,
    transformPastedText: true,
  }),

  // ========== 文本样式和格式化 ==========
  Color,
  TextStyle,
  FontSizeExtension,
  Underline,
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'highlight-marker'
    }
  }),
  Superscript,
  Subscript,

  // ========== 标题和文本对齐 ==========
  HeadingExtension,
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ['left', 'center', 'right', 'justify']
  }),

  // ========== 链接 ==========
  LinkExtension.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: '_self'
    }
  }),

  // ========== 列表 ==========
  TaskList,
  TaskItem.configure({ nested: true }),

  // ========== 表格 ==========
  Table.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 25,
    lastColumnResizable: false,
  }),
  TableRow,
  TableCellExtension,
  TableHeader,

  // ========== 代码块 ==========
  ...(!editable ? [CodeBlockExtension.configure({
    lowlight,
  })] : [CodeBlockLowlight.configure({
    lowlight,
  })]),

  // ========== 图片相关 ==========
  // 在编辑模式下使用可调整大小的图片，在只读模式下使用普通图片
  ...(editable ? [
    ResizableImageExtension,
  ] : [
    ImageExtension,
  ]),
  ImageUploadExtension.configure({
    accept: 'image/*',
    maxSize: 1024 * 1024 * (upload?.size || 20),
    limit: 1,
    upload: upload?.onUpload,
    onError: onError,
    onSuccess: (url: string) => console.log('Image upload success:', url),
  }),

  // ========== 视频相关 ==========
  // 在编辑模式下使用可调整大小的视频，在只读模式下使用普通视频
  ...(editable ? [
    ResizableVideoExtension,
  ] : [
    VideoExtension,
  ]),
  VideoUploadExtension.configure({
    accept: 'video/*',
    maxSize: 1024 * 1024 * (upload?.size || 20),
    limit: 1,
    upload: upload?.onUpload,
    onError: onError,
    onSuccess: (url: string) => console.log('Video upload success:', url),
  }),

  // ========== 交互和行为扩展 ==========
  SelectionExtension,
  TabExtension,
  TrailingNodeExtension,

  // ========== 排版 ==========
  Typography,
]);

export default extensions;