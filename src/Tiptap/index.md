# Tiptap

```tsx
import {
  TiptapEditor,
  TiptapToolbar,
  TiptapReader,
  useTiptapEditor,
} from 'ct-tiptap-editor';
import { useState, useEffect } from 'react';

export default () => {
  const [content , setContent] = useState('')
  const [json, setJson] = useState(null)
  const onReadUpdate = (value)  => console.log('🍐',value)
  const readEditorRef = useTiptapEditor({
    content: '',
    editable: false,
    onUpdate: onReadUpdate,
    onError: (error) => {
      console.log('read', error.message)
    },
  })

  const onSave = (html, json) => {
    console.log(html)
    readEditorRef?.setContent(html);
  };

  const onUpdate = (value)  => console.log('🍌',value)
  
  const handleFileUpload = async (file: File) => {
    return 'https://pandawiki.docs.baizhi.cloud/static-file/ff56bd46-7cd4-4ebc-bf75-07303d4d2c5c/8088b9cf-e12e-4eec-9f05-313c70935286.png';
  };

  const editorRef = useTiptapEditor({
    content: '',
    aiUrl: '/api/v1/creation/text',
    size: 100,
    onSave,
    onError: (error) => {
      console.log(error.message)
    },
    onUpdate,
    onUpload: handleFileUpload,
  });

  console.log(editorRef)

  const getData = () => {
    setContent('aaa')
  }

  useEffect(() => {
    if (editorRef) {
      editorRef.setContent(content).then(navs=>console.log(navs))
    }
    if (readEditorRef) { 
      readEditorRef?.setContent(content);
    }
  }, [content])

  useEffect(() => {
    if (editorRef && readEditorRef) {
      getData()
    }
  }, [editorRef, readEditorRef])

  if (!editorRef || !readEditorRef) return null;

  return (
    <>
      <div style={{ border: '1px solid #ccc' }}>
        <TiptapToolbar editorRef={editorRef} />
        <div style={{ padding: 48, height: '30vh', overflow: 'auto', border: '1px solid #ccc' }}>
          <TiptapEditor editorRef={editorRef} />
        </div>
        <div style={{ padding: 48, height: '30vh', overflow: 'auto', border: '1px solid #ccc' }}>
          <TiptapReader editorRef={readEditorRef} />
        </div>
      </div>
    </>
  );
};
```
