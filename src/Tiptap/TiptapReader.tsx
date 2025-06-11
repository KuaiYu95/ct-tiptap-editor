import { Box, Dialog } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React, { useEffect, useState } from "react";
import './index.css';

const TiptapReader = ({ editorRef }: { editorRef: UseTiptapEditorReturn }) => {
  if (!editorRef) return null;

  const content = editorRef.editor.getHTML();

  const { previewImg } = editorRef;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');

  useEffect(() => {
    const tables = editorRef.editor.options.element.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.classList.contains('editor-table')) {
        table.classList.add('editor-table');
      }
      if (!table.classList.contains('editor-table-read')) {
        table.classList.add('editor-table-read');
      }
    });
  }, [content]);

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
    <Box sx={{
      '.tiptap.ProseMirror': {
        padding: '0px !important'
      }
    }}>
      <EditorContent editor={editorRef.editor} />
      <Dialog sx={{
        '.MuiDialog-paper': {
          maxWidth: '80vw',
          maxHeight: '80vh',
        }
      }} open={previewOpen} onClose={() => {
        setPreviewOpen(false)
      }}>
        <img onClick={() => {
          setPreviewOpen(false)
        }} src={previewImgSrc} alt="preview" style={{ width: '100%', height: '100%' }} />
      </Dialog>
    </Box>
  );
};

export default TiptapReader;