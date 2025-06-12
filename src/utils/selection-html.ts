import { Editor } from '@tiptap/core';
import { DOMSerializer } from 'prosemirror-model';

function getSelectedHTML(editor: Editor) {
  const { state } = editor;
  const { selection } = state;
  const { from, to } = selection;

  // 没有选中内容时返回空字符串
  if (from === to) return '';

  // 获取选中范围的文档片段
  const fragment = state.doc.cut(from, to).content;

  // 使用 schema 创建 DOM 序列化器
  const domSerializer = DOMSerializer.fromSchema(editor.schema);

  // 将片段序列化为 DOM 节点
  const domFragment = domSerializer.serializeFragment(fragment, {
    document: window.document // 确保在浏览器环境中
  });

  // 创建临时容器并插入内容
  const container = document.createElement('div');
  container.appendChild(domFragment);

  // 返回容器内的 HTML
  return container.innerHTML;
}

export default getSelectedHTML;