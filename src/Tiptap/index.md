# Tiptap

This is an example component.

```tsx
import { TiptapEditor, TiptapToolbar, TiptapReader, useTiptapEditor} from 'ct-tiptap-editor';
import { useState } from 'react';
import { Modal } from 'ct-mui';
import { Button } from '@mui/material';

export default () => {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(true);

  const onSave = (value) => {
    console.log('onSave', value)
    editorRef?.setContent(value);
  }

  const onUpdate = (value) => {
    console.log('onUpdate', value)
  }

  const onImageUpload = (file) => {
    console.log('onImageUpload', file)
  }

  const editorRef = useTiptapEditor({
    content,
    onSave,
    onUpdate,
    // onImageUpload
  });

  if (!editorRef) return null;

  return <>
    <Button onClick={() => setOpen(true)}>editor</Button>
    <Modal 
      title={'Editor'}
      open={open} 
      width={'100vw'}
      onCancel={() => setOpen(false)}
    >
      <div style={{ 
        height: '78vh',
        border: '1px solid #ccc'
      }}>
      <div>
        <TiptapToolbar editorRef={editorRef}  />
        <TiptapEditor editorRef={editorRef} onUpdate={onUpdate} content={content} />
      </div>
      </div>
    </Modal>
  </>
}
```


```jsx
import { TiptapReader, useTiptapEditor } from 'ct-tiptap-editor';

export default () => {
  const content='<img src="https://img.alicdn.com/imgextra/i4/O1CN01aG16y424E11XsURUd_!!6000000007358-2-tps-206-240.png" />'
  const editorRef = useTiptapEditor({
    content,
    editable: false
  });
  return <div style={{ 
    width: '100%', 
    height: '500px',
    overflow: 'auto',
    border: '1px solid #ccc'
  }}>
    <TiptapReader editorRef={editorRef} />
  </div>
}
```