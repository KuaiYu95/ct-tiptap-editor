import { Dialog } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React, { useEffect, useState } from "react";
import './index.css';

const TiptapReader = ({ editorRef }: { editorRef: UseTiptapEditorReturn }) => {
  if (!editorRef) return null;

  const { previewImg } = editorRef;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');

  useEffect(() => {
    if (previewImg) {
      const src = previewImg.split('___preview___')[0];
      if (src) {
        setPreviewImgSrc(src);
        setPreviewOpen(true);
      }
    }
  }, [previewImg]);

  return (
    <>
      <EditorContent editor={editorRef.editor} />
      <Dialog open={previewOpen} onClose={() => {
        setPreviewOpen(false)
      }}>
        <img src={previewImgSrc} alt="preview" style={{ width: '100%', height: '100%' }} />
      </Dialog>
    </>
  );
};

export default TiptapReader;