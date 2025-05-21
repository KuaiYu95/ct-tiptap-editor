import { Box } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import { ThemeProvider } from "ct-mui";
import { TextSelection } from "prosemirror-state";
import React, { useEffect, useState } from "react";
import EditorToolbar from "./component/EditorToolbar";
import ImageEditDialog from "./component/ImageEditDialog";
import extensions from "./extension";
import './index.css';
import light from "./themes/light";
import componentStyleOverrides from "./themes/override";

interface TiptapEditorProps {
  content: string;
  onSave?: () => void;
  onUpdate?: (content: string) => void;
  onImageUpload?: (file: File) => string;
}

const TiptapEditor = ({ content, onSave, onUpdate, onImageUpload }: TiptapEditorProps) => {
  const [imageEditOpen, setImageEditOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [dropPosition, setDropPosition] = useState(-1)
  const [callback, setCallback] = useState<() => void>(() => { })

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          event.preventDefault()
          onSave?.()
          return true
        }
        if (event.key === 'Tab') {
          view.dispatch(view.state.tr.insertText('\t'))
        }
      },
      handlePaste: (_, event) => {
        const items = event.clipboardData?.items;
        if (!items || !items.length) return false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) continue;
            setDropPosition(-1)
            setImageFile(file)
            setImageEditOpen(true)
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = event.dataTransfer.files;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
              event.preventDefault();
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;
              const dropPosition = coordinates.pos;
              setDropPosition(dropPosition)
              setImageFile(file)
              setImageEditOpen(true)
              return true;
            }
          }
        }
        return false;
      },
    },
    extensions,
    content: content,
  });

  const handleImageEdit = async (imageUrl: string, file?: File) => {
    let url = imageUrl
    if (file && onImageUpload) {
      url = await onImageUpload(file)
    }
    setImageEditOpen(false)
    if (editor) {
      if (dropPosition === -1) {
        editor.chain().focus().setImage({ src: url }).run();
        callback?.()
      } else {
        const { state } = editor.view;
        const tr = state.tr.setSelection(TextSelection.near(state.doc.resolve(dropPosition)));
        editor.view.dispatch(tr);
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      onUpdate?.(editor.getHTML())
    }

  }, [content, editor])

  if (!editor) {
    return null;
  }

  return (
    <ThemeProvider
      colors={{ light }}
      mode="light"
      theme={{
        components: componentStyleOverrides
      }}
    >
      <Box className="editor-container" sx={{
        height: '100%',
        width: '100%',
      }}>
        <EditorToolbar
          editor={editor}
          onUpload={(file, callback) => {
            setImageFile(file)
            setImageEditOpen(true)
            setCallback(callback)
          }}
        />
        <Box className='editor-content' sx={{
          bgcolor: '#fff',
          width: 800,
          margin: 'auto',
          height: 'calc(100% - 44px)',
          overflowY: 'auto',
          '& > div': {
            height: 'calc(100%)',
          },
          '& div > .tiptap': {
            minHeight: 'calc(100% - 96px)',
            '& .ProseMirror': {
              padding: '48px',
            }
          }
        }}>
          <EditorContent editor={editor} />
        </Box>
        <ImageEditDialog
          open={imageEditOpen}
          onClose={() => setImageEditOpen(false)}
          imageFile={imageFile}
          onConfirm={handleImageEdit}
        />
      </Box>
    </ThemeProvider>
  );
};

export default TiptapEditor;