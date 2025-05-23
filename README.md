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
    // 上传图片，返回 url
    return ''
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
  const content=`<h1>HTML Elements</h1>`
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