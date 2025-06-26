import { Editor, useEditor } from "@tiptap/react";
import { extractHeadings, replacePreCode, setHeadingsId } from "ct-tiptap-editor/utils";
import { TextSelection } from "prosemirror-state";
import { useState } from "react";
import extensions from "../extension";
import { UploadFunction } from "../extension/VideoUpload";

export interface Nav {
  id: string;
  title: string;
  heading: number;
}

export interface UseTiptapEditorProps {
  content: string;
  editable?: boolean;
  size?: number
  aiUrl?: string
  onSave?: (html: string) => void;
  onUpdate?: (content: string) => void;
  onUpload?: UploadFunction
  onError?: (error: Error) => void
}

export type UseTiptapEditorReturn = {
  editor: Editor;

  setContent: (content: string) => Promise<Nav[]>;

  onUpload?: UploadFunction;
  onError?: (error: Error) => void
  aiUrl?: string

  previewImg: string;
  getNavs: () => Promise<Nav[]>;
} | null

const useTiptapEditor = ({
  content,
  size,
  editable = true,
  aiUrl,
  onSave,
  onUpdate,
  onUpload,
  onError,
}: UseTiptapEditorProps): UseTiptapEditorReturn => {
  const [previewImg, setPreviewImg] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: extensions({
      editable,
      upload: {
        size: size || 20,
        onUpload,
      },
      onError
    }),
    content: content ? setHeadingsId(replacePreCode(content)) : '',
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
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
            if (editor) {
              editor.chain()
                .focus()
                .setImageUploadNode({
                  pendingFile: file
                })
                .run();
            }
            return true;
          } else if (item.type.indexOf('video') !== -1) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) continue;
            if (editor) {
              editor.chain()
                .focus()
                .setVideoUploadNode({
                  pendingFile: file
                })
                .run();
            }
            return true;
          }
        }

        return false;
      },
      handleDrop: (view, event) => {
        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          event.preventDefault();
          const files = event.dataTransfer.files;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;
              const dropPosition = coordinates.pos;

              if (editor) {
                const tr = view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(dropPosition)));
                editor.view.dispatch(tr);
                editor.chain()
                  .focus()
                  .setImageUploadNode({
                    pendingFile: file
                  })
                  .run();
              }
              return true;
            } else if (file.type.startsWith('video/')) {
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;
              const dropPosition = coordinates.pos;

              if (editor) {
                const tr = view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(dropPosition)));
                editor.view.dispatch(tr);
                editor.chain()
                  .focus()
                  .setVideoUploadNode({
                    pendingFile: file
                  })
                  .run();
              }
              return true;
            } else if (onUpload) {
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;
              const dropPosition = coordinates.pos;
              onUpload(file).then(fileUrl => {
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
  });

  const getNavs = async (): Promise<Nav[]> => {
    if (editor) {
      const content = editor.getHTML();
      const headings = extractHeadings(content);
      return new Promise((resolve) => {
        resolve(headings);
      });
    }
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  const setContent = (content: string): Promise<Nav[]> => {
    return new Promise((resolve, reject) => {
      if (editor) {
        try {
          const html = setHeadingsId(replacePreCode(content || ''));
          editor.commands.setContent(html);
          resolve(getNavs());
        } catch (error) {
          reject(error);
        }
      }
    })
  }

  if (!editor) {
    console.log('editor is not initialized')
    return null
  }

  return {
    editor: editor!,
    aiUrl,
    onUpload,
    onError,
    previewImg,
    setContent,
    getNavs,
  };
};

export default useTiptapEditor;