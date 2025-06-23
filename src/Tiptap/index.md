# Tiptap

This is an example component.

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
    return 'https://www.baidu.com';
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
        This is a unique paragraph. It’s so unique, it even has an ID attached to it.
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
  const content =
    '<img src="https://baizhi.cloud/_next/static/media/pandaWiki_product_1.21957e3c.png" /><a href="https://www.baidu.com" target="_blank">fsjl</a><h3><strong>第一章：引子</strong></h3><a rel="noopener noreferrer nofollow" href="https://github.com/chaitin/PandaWiki/archive/refs/tags/v0.9.5.zip" download="雷池付费选型参考.md">雷池付费选型参考.md</a><p>夜幕降临，城市的喧嚣渐渐退去，只有街角的路灯还在孤独地闪烁着微弱的光芒。王观伟坐在窗前，手中捧着一杯热茶，凝视着窗外的夜色。他是一个普通的上班族，生活平淡无奇，但内心深处总有一种无法抑制的渴望，渴望冒险，渴望打破日复一日的单调。</p><table style="min-width: 125px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><td colspan="1" rowspan="1"><p>1</p></td><td colspan="1" rowspan="1"><p>2</p></td><td colspan="1" rowspan="1"><p>4</p></td><td colspan="1" rowspan="1"><p>5</p></td><td colspan="1" rowspan="1"><p>6</p></td></tr><tr><td colspan="1" rowspan="1"><p>666</p></td><td colspan="1" rowspan="1"><p>6</p></td><td colspan="1" rowspan="1"><p>6</p></td><td colspan="1" rowspan="1"><p>6</p></td><td colspan="1" rowspan="1"><p>6</p></td></tr></tbody></table><p>最近，他的生活中出现了一丝不同寻常的色彩。那是一个偶然的夜晚，他在朋友的聚会上听到了关于“寡妇村”的传闻。传闻中，这个村庄隐藏在群山之间，与世隔绝，村中居住的全是失去丈夫的寡妇。更令人好奇的是，村庄似乎笼罩着一层神秘的面纱，外人很少能接近。</p><p>“你听说过寡妇村吗？”朋友神秘兮兮地问道，语气中带着几分挑逗。</p><p>“寡妇村？”王观伟皱了皱眉头，“那是什么地方？”</p><p>“一个充满传说的地方，”朋友压低声音，“据说，那里有着不为人知的秘密。”</p><p>王观伟的好奇心被彻底激发了。他开始在网上搜索关于寡妇村的资料，但信息少之又少，似乎这个地方真的如传闻中那样神秘莫测。经过几天的思考，他做出了一个大胆的决定：亲自前往寡妇村，揭开它的神秘面纱。</p><p>这个决定让他感到兴奋，也有些忐忑不安。他知道，这次旅程可能会改变他的生活，甚至是他对世界的看法。但正是这种未知的冒险，才让他感到无比的期待。</p><img src="/static-file/c476c6b0-757e-4f21-a5b3-4bf03beea577/f19105a9-3507-492d-a6cd-eac77fffa6bb.png"><p></p>';
  const editorRef = useTiptapEditor({
    content,
    editable: false,
  });
  return (
    <div
      style={{
        width: 'calc(100% - 96px)',
        height: '500px',
        padding: 48,
        overflow: 'auto',
        border: '1px solid #ccc',
      }}
    >
      <TiptapReader editorRef={editorRef} />
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