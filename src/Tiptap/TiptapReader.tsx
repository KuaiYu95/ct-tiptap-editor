import { EditorContent, useEditor } from "@tiptap/react";
import React, { useEffect } from "react";
import extensions from "./extension";
import './index.css';

interface TiptapEditorProps {
  content: string;
}

const TiptapEditor = ({ content }: TiptapEditorProps) => {

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions,
    content: content,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }

  }, [content, editor])

  if (!editor) {
    return null;
  }

  return (
    <EditorContent editor={editor} />
  );
};

export default TiptapEditor;