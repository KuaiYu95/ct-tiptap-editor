import { useEditor } from "@tiptap/react";
import { UseTiptapEditorProps, UseTiptapEditorReturn } from "ct-tiptap-editor/types";
import { TextSelection } from "prosemirror-state";
import { useState } from "react";
import extensions from "../extension";

const useTiptapEditor = ({
  content,
  editable = true,
  onSave,
  onUpdate,
  onImageUpload
}: UseTiptapEditorProps): UseTiptapEditorReturn => {
  const [imageEditOpen, setImageEditOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dropPosition, setDropPosition] = useState(-1);
  const [callback, setCallback] = useState<() => void>(() => { });

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          event.preventDefault();
          if (editor) {
            onSave?.(editor.getHTML());
          }
          return true;
        }
        if (event.key === 'Tab') {
          view.dispatch(view.state.tr.insertText('\t'));
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
            setDropPosition(-1);
            setImageFile(file);
            setImageEditOpen(true);
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
              setDropPosition(dropPosition);
              setImageFile(file);
              setImageEditOpen(true);
              return true;
            }
          }
        }
        return false;
      },
    },
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  const handleImageEdit = async (imageUrl: string, file?: File) => {
    let url = imageUrl;
    if (file && onImageUpload) {
      url = await onImageUpload(file);
    }
    setImageEditOpen(false);
    if (editor) {
      if (dropPosition === -1) {
        editor.chain().focus().setImage({ src: url }).run();
        callback?.();
      } else {
        const { state } = editor.view;
        const tr = state.tr.setSelection(TextSelection.near(state.doc.resolve(dropPosition)));
        editor.view.dispatch(tr);
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const setContent = (content: string) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }

  if (!editor) {
    console.error('editor is not initialized')
    return null
  }

  return {
    editor: editor!,
    onImageUpload,
    imageEditOpen,
    setImageEditOpen,
    imageFile,
    setImageFile,
    handleImageEdit,
    setCallback,
    setContent,
  };
};

export default useTiptapEditor;