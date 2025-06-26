# Tiptap

This is an example component.

## 问题测试用例

```tsx
import {
  TiptapEditor,
  TiptapToolbar,
  TiptapReader,
  useTiptapEditor,
} from 'ct-tiptap-editor';
import { useState, useEffect } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  const onSave = (value) => {
    console.log('onSave', value);
    editorRef?.setContent(value);
  };

  const onUpdate = (value) => {
    console.log('onUpdate', value);
  };

  const handleFileUpload = async (file: File) => {
    return 'https://pandawiki.docs.baizhi.cloud/static-file/ff56bd46-7cd4-4ebc-bf75-07303d4d2c5c/8088b9cf-e12e-4eec-9f05-313c70935286.png';
    // 实现文件上传逻辑，返回文件URL
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.fileUrl;
  };

  const editorRef = useTiptapEditor({
    content: '',
    aiUrl: '/api/v1/creation/text',
    onSave,
    onUpdate,
    onError: (error) => {
      console.log(error.message)
    },
    onUpload: handleFileUpload,
  });

  useEffect(() => {
    if (editorRef && open) {
      editorRef
        .setContent(`<h1>
        This is a very unique heading.
      </h1>
      <p>
        This is a unique paragraph. It's so unique, it even has an ID attached to it.
      </p>
      <p>
        And this one, too.
      </p>`)
        .then((res) => console.log(res));
    }
  }, [open]);

  if (!editorRef) return null;

  return (
    <>
      <div style={{ border: '1px solid #ccc' }}>
          <TiptapToolbar editorRef={editorRef} />
          <div style={{ padding: 48, height: '50vh', overflow: 'auto' }}>
            <TiptapEditor editorRef={editorRef} />
          </div>
        </div>
    </>
  );
};
```

```jsx
import { TiptapReader, useTiptapEditor } from 'ct-tiptap-editor';

export default () => {
  const content = `<pre><code>var a = 1;\n\n\nconsole.log(a)</code></pre><p></p>`;
  
  const editorRef = useTiptapEditor({
    content,
    editable: false,
  });
  
  if (!editorRef) return <div>加载中...</div>;
  
  return (
    <div>
      <h3>输入内容:</h3>
      <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
        {content}
      </pre>
      
      <h3>渲染结果:</h3>
      <div
        style={{
          width: 'calc(100% - 96px)',
          height: '300px',
          padding: 24,
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        <TiptapReader editorRef={editorRef} />
      </div>
      
      <h3>编辑器 HTML 输出:</h3>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        fontSize: '12px',
        wordBreak: 'break-all',
      }}>
        {editorRef.editor.getHTML()}
      </div>
    </div>
  );
};
```


## MUI CSS Variables 兼容性指南

本指南解释如何确保 Tiptap Editor 在 MUI v5 和 v6 中都能正确使用 CSS 变量。

## MUI v5 配置

对于 MUI v5，CSS 变量需要手动配置。我们在 `index.css` 中提供了兼容性定义。

```javascript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // 你的主题配置
  palette: {
    primary: {
      main: '#1976d2',
    },
    // ...其他配置
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 你的应用 */}
    </ThemeProvider>
  );
}
```

## MUI v6 配置

对于 MUI v6，推荐启用自动 CSS 变量生成：

```javascript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true, // 启用 CSS 变量自动生成
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
        },
        // ...其他配置
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
        },
        // ...其他配置
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 你的应用 */}
    </ThemeProvider>
  );
}
```

## 主题切换 (仅 v6)

MUI v6 提供了内置的主题切换支持：

```javascript
import { useColorScheme } from '@mui/material/styles';

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  
  return (
    <Button 
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      切换到 {mode === 'dark' ? '浅色' : '深色'} 模式
    </Button>
  );
}
```

## 支持的 CSS 变量

我们的 CSS 文件中定义了以下变量，确保在两个版本中都能正常工作：

### 调色板变量
- `--mui-palette-primary-*`
- `--mui-palette-grey-*`
- `--mui-palette-text-*`
- `--mui-palette-background-*`
- `--mui-palette-action-*`
- `--mui-palette-warning-*`
- `--mui-palette-common-*`

### 形状变量
- `--mui-shape-borderRadius`

### 过渡变量
- `--mui-transitions-duration-*`
- `--mui-transitions-easing-*`

### 其他变量
- `--mui-palette-divider`

## 最佳实践

1. **渐进式升级**: 先确保在 v5 中一切正常，然后升级到 v6
2. **CSS 变量优先**: 在 v6 中，优先使用 `theme.vars.*` 而不是 `theme.palette.*`
3. **主题配置**: 在 v6 中使用 `colorSchemes` 配置多主题
4. **SSR 兼容**: v6 的 CSS 变量解决了 SSR 中的主题闪烁问题

## 注意事项

- 在 v6 中，当 `cssVariables: true` 时，MUI 会自动生成 CSS 变量
- 我们的 CSS 文件提供了 fallback 值，确保在任何情况下都能正常显示
- 深色模式的支持通过多种选择器确保兼容性：`[data-mui-color-scheme="dark"]`, `[data-theme="dark"]`, `.dark`

## 迁移检查清单

- [ ] 确认 MUI 版本 (v5 或 v6)
- [ ] 根据版本配置主题
- [ ] 测试浅色和深色模式
- [ ] 验证所有 CSS 变量正常工作
- [ ] 检查 SSR 兼容性 (如适用) 