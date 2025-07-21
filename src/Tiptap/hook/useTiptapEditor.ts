import { Editor, useEditor } from "@tiptap/react";
import { downloadImageAsFile, ensureHeadingIds, isValidImageUrl, processCodeBlockHtml } from "ct-tiptap-editor/utils";
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

        // 检查是否有markdown格式的base64图片
        const textData = event.clipboardData?.getData('text/plain');
        if (textData) {
          // 匹配markdown格式的base64图片: ![alt](data:image/xxx;base64,xxx)
          const base64ImageRegex = /!\[([^\]]*)\]\(data:image\/([^;]+);base64,([^)]+)\)/g;
          const matches = Array.from(textData.matchAll(base64ImageRegex));

          if (matches.length > 0) {
            event.preventDefault();

            // 处理每个匹配的base64图片
            const processBase64Images = async () => {
              for (const match of matches) {
                const [, alt, mimeType, base64Data] = match;

                try {
                  // 将base64转换为File对象
                  const byteCharacters = atob(base64Data);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);

                  // 确保MIME类型正确
                  const fileExtension = mimeType.split('/')[1] || 'png';
                  const fileName = `image.${fileExtension}`;
                  const fileType = mimeType || 'image/png';

                  const file = new File([byteArray], fileName, { type: fileType });

                  if (editor) {
                    editor.chain()
                      .focus()
                      .setImageUploadNode({
                        pendingFile: file
                      })
                      .run();
                  }
                } catch (error) {
                  console.error('处理base64图片失败:', error);
                  onError?.(new Error('处理base64图片失败'));
                }
              }
            };

            processBase64Images();
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
        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!coordinates) return false;
        const dropPosition = coordinates.pos;

        // 处理本地文件拖拽
        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          event.preventDefault();
          const files = event.dataTransfer.files;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
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

        if (event.dataTransfer && onUpload) {
          const imageUrl = event.dataTransfer.getData('text/uri-list') ||
            event.dataTransfer.getData('text/plain') ||
            event.dataTransfer.getData('URL');

          const htmlData = event.dataTransfer.getData('text/html');
          let extractedImageUrl = imageUrl;

          if (htmlData && !isValidImageUrl(extractedImageUrl)) {
            const imgMatch = htmlData.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
            if (imgMatch) {
              extractedImageUrl = imgMatch[1];
            }
          }

          if (extractedImageUrl && isValidImageUrl(extractedImageUrl)) {
            event.preventDefault();

            if (editor) {
              const tr = view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(dropPosition)));
              editor.view.dispatch(tr);
            }

            downloadImageAsFile(extractedImageUrl)
              .then(file => {
                if (file && editor && onUpload) {
                  return onUpload(file);
                }
                throw new Error('编辑器或上传函数不可用');
              })
              .then(uploadedUrl => {
                if (editor && uploadedUrl) {
                  editor.chain()
                    .focus()
                    .setImage({ src: uploadedUrl })
                    .run();
                }
              })
              .catch(error => {
                onError?.(new Error(`处理拖拽图片失败: ${error instanceof Error ? error.message : '未知错误'}`));
              });

            return true;
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