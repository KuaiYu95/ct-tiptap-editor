import { Editor, useEditor } from "@tiptap/react";
import { extractHeadings, setHeadingsId } from "ct-tiptap-editor/utils";
import { TextSelection } from "prosemirror-state";
import { useState } from "react";
import extensions from "../extension";

export interface Nav {
  id: string;
  title: string;
  heading: number;
}

export interface UseTiptapEditorProps {
  content: string;
  editable?: boolean;
  onSave?: (html: string) => void;
  onUpdate?: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  onFileUpload?: (file: File) => Promise<string>;
}

export type UseTiptapEditorReturn = {
  editor: Editor;
  setCallback: (callback: () => void) => void;
  setContent: (content: string) => Promise<Nav[]>;

  onFileUpload?: (file: File) => Promise<string>;

  imageEditOpen: boolean;
  setImageEditOpen: (open: boolean) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onImageUpload?: (file: File) => Promise<string>;
  handleImageEdit: (imageUrl: string, file?: File) => void;
  previewImg: string;
  getNavs: () => Promise<Nav[]>;
} | null

const useTiptapEditor = ({
  content,
  editable = true,
  onSave,
  onUpdate,
  onImageUpload,
  onFileUpload,
}: UseTiptapEditorProps): UseTiptapEditorReturn => {
  const [previewImg, setPreviewImg] = useState('');
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
      handleClick: (view, pos, event) => {
        if (!editable) {
          const target = event.target as HTMLElement;
          if (target.tagName === 'IMG') {
            const src = target.getAttribute('src');
            if (src) setPreviewImg(src + '___preview___' + Date.now().toString());
            else setPreviewImg('');
            return true;
          }
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          event.preventDefault();
          if (editor) onSave?.(editor.getHTML());
          return true;
        }
        if (event.key === 'Tab') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          let isList = false;
          let depth = $from.depth;
          while (depth > 0) {
            const node = $from.node(depth);
            if (node.type.name === 'bulletList' ||
              node.type.name === 'orderedList' ||
              node.type.name === 'taskList' ||
              node.type.name === 'listItem') {
              isList = true;
              break;
            }
            depth--;
          }

          if (!isList) {
            view.dispatch(state.tr.insertText('\t'));
          }
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
            } else if (onFileUpload) {
              event.preventDefault();
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;
              const dropPosition = coordinates.pos;
              onFileUpload(file).then(fileUrl => {
                if (editor) {
                  const tr = view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(dropPosition)));
                  editor.view.dispatch(tr);
                  editor.chain()
                    .focus()
                    .insertContent(`<a href="${fileUrl}" download="${file.name}">📎 ${file.name}</a>`)
                    .run();
                  return true;
                }
                return false;
              });
              return true;
            }
          }
        }
        return false;
      },
    },
    extensions,
    content: content ? setHeadingsId(content) : '',
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

  const getNavs = async (): Promise<Nav[]> => {
    if (editor) {
      const content = editor.getHTML();
      const headings = extractHeadings(content);
      const hasHeadNoId = headings.some(heading => !heading.id);
      if (hasHeadNoId) {
        const headings = await setContent(content);
        return headings;
      }
      return new Promise((resolve) => {
        resolve(headings);
      });
    }
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  const setContent = (content: string): Promise<Nav[]> => {
    return new Promise((resolve) => {
      if (editor) {
        const html = setHeadingsId(content || '');
        editor.commands.setContent(html);
        getNavs().then(resolve);
      }
    })
  }

  if (!editor) {
    console.error('editor is not initialized')
    return null
  }

  return {
    editor: editor!,

    onFileUpload,
    onImageUpload,
    imageEditOpen,
    setImageEditOpen,
    imageFile,
    setImageFile,
    handleImageEdit,
    previewImg,

    setCallback,
    setContent,

    getNavs,
  };
};

export default useTiptapEditor;