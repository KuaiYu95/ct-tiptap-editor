import { Box } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { type UseTiptapEditorReturn } from "ct-tiptap-editor";
import React from "react";
import DragHandle from "./component/DragHandler";
import { DragIcon } from "./icons/drag-icon";
import './index.css';

interface TiptapEditorProps {
  editorRef: UseTiptapEditorReturn;
}

const TiptapEditor = ({ editorRef }: TiptapEditorProps) => {
  const { editor } = editorRef;
  return (
    <>
      <DragHandle editor={editor}>
        <DragIcon sx={{ width: 16, height: 16, color: 'text.auxiliary' }} />
      </DragHandle>
      <Box className="editor-container" >
        <EditorContent editor={editor} />
      </Box>
    </>
  );
};

export default TiptapEditor;