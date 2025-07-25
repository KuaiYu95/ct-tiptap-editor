import { Divider, Stack } from "@mui/material";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React from "react";
import EditorAIAssistant from "./component/EditorAIAssistant";
import EditorAlign from "./component/EditorAlign";
import EditorCode from "./component/EditorCode";
import EditorFontSize from "./component/EditorFontSize";
import EditorHeading from "./component/EditorHeading";
import HighlightButton from "./component/EditorHighlight";
import EditorLink from "./component/EditorLink";
import EditorListSelect from "./component/EditorListSelect";
import EditorMath from "./component/EditorMath";
import EditorTable from "./component/EditorTable";
import EditorTextColor from "./component/EditorTextColor";
import EditorToolbarButton from "./component/EditorToolbarButton";
import EditorUpload from "./component/EditorUpload";
import { BlockQuoteIcon } from "./icons/block-quote-icon";
import { BoldIcon } from "./icons/bold-icon";
import { ItalicIcon } from "./icons/italic-icon";
import { Redo2Icon } from "./icons/redo2-icon";
import { StrikeIcon } from "./icons/strike-icon";
import { SubscriptIcon } from "./icons/subscript-icon";
import { SuperscriptIcon } from "./icons/superscript-icon";
import { UnderlineIcon } from "./icons/underline-icon";
import { Undo2Icon } from "./icons/undo2-icon";

type EditorToolbarProps = {
  editorRef: UseTiptapEditorReturn
}

const EditorToolbar = ({ editorRef }: EditorToolbarProps) => {
  if (!editorRef || !editorRef.editor) return null;
  const { editor, onUpload, aiUrl, onError } = editorRef;
  return <Stack
    direction={'row'}
    alignItems={'center'}
    gap={0.5}
    justifyContent={'center'}
    className="tiptap-toolbar"
    sx={{
      height: '44px',
      boxSizing: 'border-box',
      borderBottom: '1px solid',
      borderColor: 'divider',
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
        bgcolor: 'background.paper',
        '.MuiSelect-select': {
          p: '0 !important',
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
    <EditorCode editor={editor} />
    <EditorMath editor={editor} />
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
    <EditorUpload editor={editor} onUpload={onUpload} />
    <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
    <EditorAIAssistant editor={editor} aiUrl={aiUrl} onError={onError} />
  </Stack>
}

export default EditorToolbar