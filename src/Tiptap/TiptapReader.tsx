import { Box, Dialog } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React, { useEffect, useState } from "react";
import './index.css';

const TiptapReader = ({ editorRef }: { editorRef: UseTiptapEditorReturn }) => {
  const [content, setContent] = useState('');

  const { previewImg } = editorRef;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');

  useEffect(() => {
    if (editorRef.editor) {
      setContent(editorRef.editor.getHTML());
    }
  }, [editorRef.editor])

  useEffect(() => {
    if (!editorRef.editor) return;
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
      <Box className="editor-container" >
        <EditorContent editor={editorRef.editor} />
      </Box>
      <Dialog sx={{
        '.MuiDialog-paper': {
          maxWidth: '95vw',
          maxHeight: '95vh',
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