import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { Markdown } from 'tiptap-markdown';

export interface CustomMarkdownExtensionOptions {
  onUpload?: (file: File) => Promise<string>;
  onError?: (error: Error) => void;
}

export const CustomMarkdownExtension = Extension.create<CustomMarkdownExtensionOptions>({
  name: 'customMarkdown',

  addOptions() {
    return {
      onUpload: undefined,
      onError: undefined,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view: any, event: ClipboardEvent) => {
            const textData = event.clipboardData?.getData('text/plain');
            if (!textData) return false;

            // 匹配markdown格式的base64图片: ![alt](data:image/xxx;base64,xxx)
            const base64ImageRegex = /!\[([^\]]*)\]\(data:image\/([^;]+);base64,([^)]+)\)/g;
            const matches = Array.from(textData.matchAll(base64ImageRegex));

            if (matches.length > 0 && this.options.onUpload) {
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

                    // 上传文件
                    const url = await this.options.onUpload!(file);

                    // 插入图片
                    const { tr } = view.state;
                    const { selection } = view.state;
                    const imageNode = view.state.schema.nodes.image.create({
                      src: url,
                      alt: alt || 'image',
                    });

                    view.dispatch(tr.replaceSelection(imageNode));
                  } catch (error) {
                    console.error('处理base64图片失败:', error);
                    this.options.onError?.(new Error('处理base64图片失败'));
                  }
                }
              };

              processBase64Images();
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

// 创建一个包装的Markdown扩展
export const createCustomMarkdownExtension = (options: CustomMarkdownExtensionOptions) => {
  return [
    CustomMarkdownExtension.configure(options),
    Markdown.configure({
      html: true,
      breaks: false,
      transformPastedText: true,
      transformCopiedText: false,
    }),
  ];
}; 