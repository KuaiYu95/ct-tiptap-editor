import { EditorContent } from "@tiptap/react";
import { UseTiptapEditorReturn } from "ct-tiptap-editor/hook/useTiptapEditor";
import React from "react";
import './index.css';

const TiptapReader = ({ editorRef }: { editorRef: UseTiptapEditorReturn }) => {
  if (!editorRef) return null;

  return (
    <EditorContent editor={editorRef.editor} />
  );
};

export default TiptapReader;