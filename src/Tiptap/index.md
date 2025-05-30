# Tiptap

This is an example component.

```tsx
import { TiptapEditor, TiptapToolbar, useTiptapEditor} from 'ct-tiptap-editor';
import { useState } from 'react';

export default () => {
  const [content, setContent] = useState('');

  const onSave = (value) => {
    console.log('onSave', value)
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
    onImageUpload
  });

  if (!editorRef) return null;

  return <div style={{ 
    width: '100%', 
    border: '1px solid #ccc'
  }}>
  <div>
    <TiptapToolbar editorRef={editorRef}  />
    <TiptapEditor editorRef={editorRef} onUpdate={onUpdate} content={content} />
  </div>
</div>
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