import { Divider, Stack } from "@mui/material";
import { ThemeProvider } from "ct-mui";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React from "react";
import EditorAlign from "./component/EditorAlign";
import EditorAttachment from "./component/EditorAttachment";
import EditorFontSize from "./component/EditorFontSize";
import EditorHeading from "./component/EditorHeading";
import HighlightButton from "./component/EditorHighlight";
import EditorImage from "./component/EditorImage";
import EditorLink from "./component/EditorLink";
import EditorListSelect from "./component/EditorListSelect";
import EditorTable from "./component/EditorTable";
import EditorTextColor from "./component/EditorTextColor";
import EditorToolbarButton from "./component/EditorToolbarButton";
import { BlockQuoteIcon } from "./icons/block-quote-icon";
import { BoldIcon } from "./icons/bold-icon";
import { CodeBlockIcon } from "./icons/code-block-icon";
import { Code2Icon } from "./icons/code2-icon";
import { ItalicIcon } from "./icons/italic-icon";
import { Redo2Icon } from "./icons/redo2-icon";
import { StrikeIcon } from "./icons/strike-icon";
import { SubscriptIcon } from "./icons/subscript-icon";
import { SuperscriptIcon } from "./icons/superscript-icon";
import { UnderlineIcon } from "./icons/underline-icon";
import { Undo2Icon } from "./icons/undo2-icon";
import light from "./themes/light";
import componentStyleOverrides from "./themes/override";

type EditorToolbarProps = {
  editorRef: UseTiptapEditorReturn
  onFileUpload?: (file: File) => Promise<string>;
}

const EditorToolbar = ({ editorRef, onFileUpload }: EditorToolbarProps) => {
  if (!editorRef) return null;
  const { editor } = editorRef;
  return <ThemeProvider
    colors={{ light }}
    mode="light"
    theme={{
      components: componentStyleOverrides
    }}
  >
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={0.5}
      justifyContent={'center'}
      className="tiptap-toolbar"
      sx={{
        height: '44px',
        boxSizing: 'border-box',
        borderBottom: '1px solid #ccc',
        '.MuiButton-root': {
          minWidth: '36px',
          p: 1,
          color: 'text.primary',
          '&.active': {
            bgcolor: 'background.paper0',
            color: 'primary.main',
          },
          '&[disabled]': {
            color: 'text.disabled',
          }
        },
        '.MuiSelect-root': {
          minWidth: '36px',
          bgcolor: '#fff',
          '.MuiSelect-select': {
            p: 0,
          },
          input: {
            display: 'none',
          },
          '&.active': {
            bgcolor: 'background.paper0',
            color: 'primary.main',
            button: {
              color: 'primary.main',
            }
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderWidth: '0px !important',
          }
        }
      }}
    >
      <EditorToolbarButton
        tip={'撤销'}
        shortcutKey={['ctrl', 'Z']}
        icon={<Undo2Icon />}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <EditorToolbarButton
        tip={'重做'}
        shortcutKey={['ctrl', 'Y']}
        icon={<Redo2Icon />}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorHeading editor={editor} />
      <EditorFontSize editor={editor} />
      <EditorListSelect editor={editor} />
      <EditorAlign editor={editor} />
      <EditorToolbarButton
        tip={'引用'}
        shortcutKey={['ctrl', 'shift', 'B']}
        icon={<BlockQuoteIcon />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorToolbarButton
        tip={'加粗'}
        shortcutKey={['ctrl', 'B']}
        icon={<BoldIcon />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
      />
      <EditorToolbarButton
        tip={'斜体'}
        shortcutKey={['ctrl', 'I']}
        icon={<ItalicIcon />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      />
      <EditorToolbarButton
        tip={'删除线'}
        shortcutKey={['ctrl', 'shift', 'S']}
        icon={<StrikeIcon />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorToolbarButton
        tip={'下划线'}
        shortcutKey={['ctrl', 'U']}
        icon={<UnderlineIcon />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      />
      <HighlightButton editor={editor} />
      <EditorTextColor editor={editor} />
      <EditorLink editor={editor} />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorToolbarButton
        tip={'代码块'}
        icon={<CodeBlockIcon />}
        shortcutKey={['ctrl', 'alt', 'C']}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "active" : ""}
      />
      <EditorToolbarButton
        tip={'代码'}
        shortcutKey={['ctrl', 'E']}
        icon={<Code2Icon />}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "active" : ""}
      />
      <EditorTable editor={editor} />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorToolbarButton
        tip={'上标'}
        shortcutKey={['ctrl', '.']}
        icon={<SuperscriptIcon />}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive("superscript") ? "active" : ""}
      />
      <EditorToolbarButton
        tip={'下标'}
        shortcutKey={['ctrl', ',']}
        icon={<SubscriptIcon />}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive("subscript") ? "active" : ""}
      />
      <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
      <EditorImage imageUpload={(file: File, callback: () => void) => {
        editorRef.setCallback(callback)
        editorRef.setImageFile(file)
        editorRef.setImageEditOpen(true)
      }} />
      {onFileUpload && <EditorAttachment editor={editor} onFileUpload={onFileUpload} />}
    </Stack>
  </ThemeProvider>
}

export default EditorToolbar