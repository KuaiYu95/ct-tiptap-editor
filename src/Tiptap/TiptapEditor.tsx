import { Box } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { ThemeProvider } from "ct-mui";
import { UseTiptapEditorReturn } from "ct-tiptap-editor/types";
import React from "react";
import ImageEditDialog from "./component/ImageEditDialog";
import './index.css';
import light from "./themes/light";
import componentStyleOverrides from "./themes/override";

interface TiptapEditorProps {
  editorRef: UseTiptapEditorReturn;
}

const TiptapEditor = ({ editorRef }: TiptapEditorProps) => {
  if (!editorRef) return null;

  const { editor, imageEditOpen, setImageEditOpen, imageFile, handleImageEdit } = editorRef;
  return (
    <ThemeProvider
      colors={{ light }}
      mode="light"
      theme={{
        components: componentStyleOverrides
      }}
    >
      <Box className="editor-container" >
        <EditorContent editor={editor} />
      </Box>
      <ImageEditDialog
        open={imageEditOpen}
        onClose={() => setImageEditOpen(false)}
        imageFile={imageFile}
        onConfirm={handleImageEdit}
      />
    </ThemeProvider>
  );
};

export default TiptapEditor;