import { Editor } from "@tiptap/core";

export interface UseTiptapEditorProps {
  content: string;
  editable?: boolean;
  onSave?: (html: string) => void;
  onUpdate?: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export type UseTiptapEditorReturn = {
  editor: Editor;
  imageEditOpen: boolean;
  setImageEditOpen: (open: boolean) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onImageUpload: (file: File) => Promise<string>;
  handleImageEdit: (imageUrl: string, file?: File) => void;
  setCallback: (callback: () => void) => void;
  setContent: (content: string) => void;
} | null