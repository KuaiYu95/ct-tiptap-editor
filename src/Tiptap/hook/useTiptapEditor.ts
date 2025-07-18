import { Editor, useEditor } from "@tiptap/react";
import { TextSelection } from "prosemirror-state";
import { useCallback, useMemo, useState } from "react";
import extensions from "../extension";
import { UploadFunction } from "../extension/VideoUploadExtension";

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
  immediatelyRender?: boolean
  onSave?: (html: string, json: object | null) => void;
  onUpdate?: (content: string, json: any) => void;
  onUpload?: UploadFunction
  onError?: (error: Error) => void
}

export type UseTiptapEditorReturn = {
  aiUrl?: string
  previewImg: string;

  editor: Editor;

  getHtml: () => string;
  getNavs: () => Promise<Nav[]>;
  setJson: (json: object | null) => void;
  setContent: (content: string) => Promise<Nav[]>;

  onUpload?: UploadFunction;
  onError?: (error: Error) => void
} | null

// 辅助函数：确保所有标题都有ID
const ensureHeadingIds = (editor: Editor): boolean => {
  let hasChanges = false;
  const tr = editor.state.tr;
  const existingIds = new Set<string>();

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      if (existingIds.has(node.attrs.id) || !node.attrs.id || node.attrs.id.length !== 22) {
        const newId = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, id: newId.slice(0, 22) });
        hasChanges = true;
      }
      existingIds.add(node.attrs.id);
    }
  });

  if (hasChanges) {
    editor.view.dispatch(tr);
  }

  return hasChanges;
};

// 辅助函数：处理代码块中的换行符
const processCodeBlockHtml = (html: string): string => {
  // 使用正则表达式匹配代码块内容并替换换行符
  return html.replace(
    /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (match, codeContent) => {
      // 将代码内容中的 \n 替换为 <br>
      const processedContent = codeContent.replace(/\n/g, '<br>');
      return match.replace(codeContent, processedContent);
    }
  );
};

const useTiptapEditor = ({
  content,
  size,
  editable = true,
  aiUrl,
  onSave,
  onUpdate,
  onUpload,
  onError,
  immediatelyRender = true,
}: UseTiptapEditorProps): UseTiptapEditorReturn => {
  const [previewImg, setPreviewImg] = useState('');

  const editorExtensions = useMemo(() => extensions({
    editable,
    upload: {
      size: size || 20,
      onUpload,
    },
    onError
  }), [editable, size, onUpload, onError]);

  const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
    onUpdate?.(editor.getHTML(), editor.getJSON());
  }, [onUpdate]);

  const editor = useEditor({
    immediatelyRender,
    editable,
    extensions: editorExtensions,
    content: content,
    onUpdate: handleUpdate,
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
          if (editor) {
            const originalHtml = editor.getHTML();
            const processedHtml = processCodeBlockHtml(originalHtml);
            onSave?.(processedHtml, editor.getJSON());
          }
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

        const htmlData = event.clipboardData?.getData('text/html');
        if (htmlData?.includes('<h')) {
          setTimeout(() => {
            if (editor) {
              ensureHeadingIds(editor);
            }
          }, 10);
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
      // 首先确保所有标题都有ID
      const wasUpdated = ensureHeadingIds(editor);

      if (wasUpdated) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const headings: Nav[] = [];
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level || 1;
          const id = node.attrs.id || '';
          const title = node.textContent || '';

          headings.push({
            id,
            title,
            heading: level
          });
        }
      });

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
          editor.commands.setContent(content || '');

          setTimeout(() => {
            ensureHeadingIds(editor);
            getNavs().then(resolve);
          }, 10);
        } catch (error) {
          reject(error);
        }
      }
    })
  }

  const setJson = (json: object | null) => {
    if (editor) {
      editor.commands.setContent(json);
    }
  }

  const getHtml = () => {
    if (editor) {
      const originalHtml = editor.getHTML();
      const processedHtml = processCodeBlockHtml(originalHtml);
      return processedHtml;
    }
    return '';
  }

  if (!editor) {
    return null
  }

  return {
    editor,
    aiUrl,
    onUpload,
    onError,
    previewImg,
    getHtml,
    setContent,
    setJson,
    getNavs,
  };
};

export default useTiptapEditor;