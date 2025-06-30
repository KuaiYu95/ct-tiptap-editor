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
    setJson(json)
    if (json) {
      readEditorRef?.setJson(json)
    }
    // readEditorRef?.setContent(value);
  };

  const onUpdate = (value)  => console.log('🍌',value)
  
  const handleFileUpload = async (file: File) => {
    return 'https://pandawiki.docs.baizhi.cloud/static-file/ff56bd46-7cd4-4ebc-bf75-07303d4d2c5c/8088b9cf-e12e-4eec-9f05-313c70935286.png';
  };

  const editorRef = useTiptapEditor({
    content: '',
    aiUrl: '/api/v1/creation/text',
    onSave,
    onError: (error) => {
      console.log(error.message)
    },
    onUpdate,
    onUpload: handleFileUpload,
  });

  const getData = () => {
    setContent("\u003Ch1 class=\"heading\" id=\"3la9ndjw7plfsde3isrewf\"\u003E环境依赖\u003C/h1\u003E\u003Cp\u003E安装雷池前请确保你的系统环境符合以下要求\u003C/p\u003E\u003Cul class=\"tight\" data-tight=\"true\"\u003E\u003Cli\u003E\u003Cp\u003E操作系统：Linux\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003ECPU 指令架构：x86_64, arm64\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003ECPU 指令架构：x86_64 架构需要支持 ssse3 指令集\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003E软件依赖：Docker 20.10.14 版本以上\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003E软件依赖：Docker Compose 2.0.0 版本以上\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003E最低资源需求：1 核 CPU / 1 GB 内存 / 5 GB 磁盘\u003C/p\u003E\u003C/li\u003E\u003C/ul\u003E\u003Cp\u003E可以根据以下命令来查看相关信息\u003C/p\u003E\u003Cpre\u003E\u003Ccode class=\"language-bash\"\u003Euname -m                                    # 查看指令架构\ncat /proc/cpuinfo| grep \"processor\"         # 查看 CPU 信息\nlscpu | grep ssse3                          # 确认 CPU 是否支持 ssse3 指令集\ndocker version                              # 查看 Docker 版本\ndocker compose version                      # 查看 Docker Compose 版本\ndocker-compose version                      # 查看老版本 docker-compose 版本\nfree -h                                     # 查看内存信息\ndf -h                                       # 查看磁盘信息\u003C/code\u003E\u003C/pre\u003E\u003Ch1 class=\"heading\" id=\"u3bst0u34d8des6q5njive\"\u003E安装雷池\u003C/h1\u003E\u003Ch2 class=\"heading\" id=\"n5tqbjvd8dpv0se4szyrwc\"\u003E选择安装方式\u003C/h2\u003E\u003Cp\u003E根据实际情况选择安装方式\u003C/p\u003E\u003Cul class=\"tight\" data-tight=\"true\"\u003E\u003Cli\u003E\u003Cp\u003E\u003Cstrong\u003E自动安装\u003C/strong\u003E : 使用一条命令自动化安装，推荐新手使用\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003E\u003Cstrong\u003E手动安装\u003C/strong\u003E : 如果你熟悉 Linux 和 Docker，可以手动来配置雷池环境\u003C/p\u003E\u003C/li\u003E\u003Cli\u003E\u003Cp\u003E\u003Cstrong\u003E离线环境安装\u003C/strong\u003E : 如果你的环境无法连接互联网，可以通过这种方式下载离线安装包\u003C/p\u003E\u003C/li\u003E\u003C/ul\u003E\u003Ch2 class=\"heading\" id=\"17vktogpyqt3g3ukjeguvn\"\u003E自动安装\u003C/h2\u003E\u003Cp\u003E一键安装：3 分钟即可完成自动安装。\u003C/p\u003E\u003Cpre\u003E\u003Ccode\u003Ebash -c \"$(curl -fsSLk https://waf-ce.chaitin.cn/release/latest/manager.sh)\"\u003C/code\u003E\u003C/pre\u003E\u003Cp\u003E命令执行成功则代表雷池安装成功，现在你可以访问雷池控制台了\u003C/p\u003E\u003Ch2 class=\"heading\" id=\"2qq6mrbc0x71aokahrjjsr\"\u003E手动安装\u003C/h2\u003E\u003Cp\u003E如果你熟悉 Linux 和 Docker，可以手动来配置雷池环境。\u003C/p\u003E\u003Cp\u003E具体步骤请参考 \u003Ca target=\"_self\" rel=\"noopener noreferrer nofollow\" href=\"\"\u003E手动安装雷池\u003C/a\u003E\u003C/p\u003E\u003Ch2 class=\"heading\" id=\"yq8ebgbmk1s4fhy830ig7h\"\u003E离线环境安装\u003C/h2\u003E\u003Cp\u003E如果你的环境无法连接互联网，可以通过这种方式进行离线安装。\u003C/p\u003E\u003Cp\u003E具体步骤请参考 \u003Ca target=\"_self\" rel=\"noopener noreferrer nofollow\" href=\"https://help.waf-ce.chaitin.cn/node/01973fc6-e046-7489-bcd9-7b1554393895\"\u003E离线安装雷池\u003C/a\u003E\u003C/p\u003E\u003Ch1 class=\"heading\" id=\"3i5wlttdopgh0wizwjjv8r\"\u003E访问雷池控制台\u003C/h1\u003E\u003Cp\u003E雷池安装成功以后，你可以打开浏览器访问 \u003Ccode\u003Ehttps://&lt;safeline-ip&gt;:9443/\u003C/code\u003E 来使用雷池控制台。\u003C/p\u003E\u003Cblockquote\u003E\u003Cp\u003E注意对 9443 的端口打开访问\u003C/p\u003E\u003C/blockquote\u003E\u003Ch2 class=\"heading\" id=\"03x2syaar8cbpecfa8vc1v\"\u003E登录雷池\u003C/h2\u003E\u003Cp\u003E第一次登录雷池需要初始化你的管理员账户（默认会执行），如果没有找到账户密码，手动执行以下命令即可\u003C/p\u003E\u003Cpre\u003E\u003Ccode class=\"language-bash\"\u003Edocker exec safeline-mgt resetadmin\u003C/code\u003E\u003C/pre\u003E\u003Cp\u003E命令执行完成后会随机重置 \u003Ccode\u003Eadmin\u003C/code\u003E 账户的密码，输出结果如下\u003C/p\u003E\u003Cpre\u003E\u003Ccode class=\"language-bash\"\u003E[SafeLine] Initial username：admin\n[SafeLine] Initial password：**********\n[SafeLine] Done\u003C/code\u003E\u003C/pre\u003E\u003Ch2 class=\"heading\" id=\"256ccuqadalgolmh3vxx57\"\u003E开始防护你的网站\u003C/h2\u003E\u003Cp\u003E现在可以开始随心所欲使用你的雷池了，可参考 \u003Ca target=\"_self\" rel=\"noopener noreferrer nofollow\" href=\"/node/01973fc6-e14a-7234-8acd-bdba21c8b3f3\"\u003E添加应用\u003C/a\u003E 来防护你的网站\u003C/p\u003E\u003Cblockquote\u003E\u003Cp\u003E如有其他疑问，可以直接咨询页面右侧的雷池 ai 小助手，或者在百川论坛搜索，咨询企业微信群内的\u003Cstrong\u003E张华杰\u003C/strong\u003E\u003C/p\u003E\u003C/blockquote\u003E\u003Cp\u003E\u003C/p\u003E")
  }

  useEffect(() => {
    if (editorRef) {
      editorRef.setContent(content).then(navs=>console.log(navs))
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