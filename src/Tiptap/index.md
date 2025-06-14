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
import { Modal } from 'ct-mui';

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
