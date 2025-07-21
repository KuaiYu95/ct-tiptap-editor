import { Editor } from "@tiptap/core";
import { MAC_SYMBOLS } from "./enums";

export const isMac = () => typeof navigator !== "undefined" &&
  navigator.platform.toLowerCase().includes("mac")

export const getShortcutKeyText = (shortcutKey: string[]) => {
  return shortcutKey?.map(it => (isMac() ? (MAC_SYMBOLS[it as keyof typeof MAC_SYMBOLS] || it) : it)).join('+');
}

export const replacePreCode = (html: string) => {
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, codeContent) => {
    const processedCode = codeContent.replace(/\n/g, '<br/>');
    return `<pre><code>${processedCode}</code></pre>`;
  });
}

export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    // 检查协议是否为http或https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    // 检查URL是否包含常见的图片文件扩展名或者是常见的图片服务域名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const pathname = parsedUrl.pathname.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => pathname.includes(ext));

    // 常见的图片服务域名
    const imageHosts = ['imgur.com', 'unsplash.com', 'pexels.com', 'pixabay.com', 'cdn.', 'img.'];
    const hostname = parsedUrl.hostname.toLowerCase();
    const isImageHost = imageHosts.some(host => hostname.includes(host));

    return hasImageExtension || isImageHost || pathname.includes('image') || parsedUrl.search.includes('image');
  } catch {
    return false;
  }
};

export const downloadImageAsFile = async (imageUrl: string): Promise<File> => {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // 检查响应的Content-Type是否为图片类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      // 如果没有正确的content-type，尝试从URL推断
      const url = new URL(imageUrl);
      const pathname = url.pathname.toLowerCase();
      let mimeType = 'image/png'; // 默认

      if (pathname.includes('.jpg') || pathname.includes('.jpeg')) {
        mimeType = 'image/jpeg';
      } else if (pathname.includes('.png')) {
        mimeType = 'image/png';
      } else if (pathname.includes('.gif')) {
        mimeType = 'image/gif';
      } else if (pathname.includes('.webp')) {
        mimeType = 'image/webp';
      } else if (pathname.includes('.svg')) {
        mimeType = 'image/svg+xml';
      }

      // 创建新的blob with正确的MIME类型
      const correctedBlob = new Blob([blob], { type: mimeType });
      return new File([correctedBlob], `image-${Date.now()}.${mimeType.split('/')[1]}`, {
        type: mimeType
      });
    }

    // 从URL生成文件名
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    let filename = pathParts[pathParts.length - 1];

    if (!filename || !filename.includes('.')) {
      // 从content-type生成扩展名
      const extension = contentType.split('/')[1];
      filename = `image-${Date.now()}.${extension}`;
    }

    return new File([blob], filename, {
      type: contentType
    });
  } catch (error) {
    console.error('下载图片失败:', error);
    throw new Error(`无法下载图片: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

export const ensureHeadingIds = (editor: Editor): boolean => {
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

export const processCodeBlockHtml = (html: string): string => {
  return html.replace(
    /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (match, codeContent) => {
      // 将代码内容中的 \n 替换为 <br>
      const processedContent = codeContent.replace(/\n/g, '<br>');
      return match.replace(codeContent, processedContent);
    }
  );
};