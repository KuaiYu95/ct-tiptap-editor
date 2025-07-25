import React, { useRef } from 'react';
import { UseTiptapEditorReturn } from '../hook/useTiptapEditor';
import { AttachmentIcon } from '../icons/attachment-icon';
import EditorToolbarButton from './EditorToolbarButton';

type EditorAttachmentProps = {
  editorRef: UseTiptapEditorReturn;
}

const EditorAttachment = ({ editorRef }: EditorAttachmentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editorRef.onUpload) return;

    try {
      const fileUrl = await editorRef.onUpload(file);
      editorRef.editor
        ?.chain()
        .focus()
        .insertContent(`<a href="${fileUrl}" download="${file.name}">📎 ${file.name}</a>`)
        .run();
    } catch (error) {
      console.error('文件上传失败:', error);
    }

    // 重置 input 值，以便可以重复选择同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <EditorToolbarButton
        tip="添加附件"
        icon={<AttachmentIcon sx={{ fontSize: 17 }} />}
        onClick={() => fileInputRef.current?.click()}
      />
    </>
  );
};

export default EditorAttachment;