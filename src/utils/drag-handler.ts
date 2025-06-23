'use client'
import { Editor, Extension } from "@tiptap/core";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import tippy from "tippy.js";
import {
  absolutePositionToRelativePosition,
  ySyncPluginKey
} from "y-prosemirror";
import {
  getSelectionRanges,
  NodeRangeSelection
} from "./node-range";

/**
 * 克隆节点及其所有子节点的样式
 */
function cloneNodeWithStyles(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  const originalElements = [node, ...Array.from(node.getElementsByTagName("*"))];
  const cloneElements = [clone, ...Array.from(clone.getElementsByTagName("*"))];

  originalElements.forEach((original, index) => {
    const styles = getComputedStyle(original);
    let cssText = "";
    for (let i = 0; i < styles.length; i++) {
      cssText += `${styles[i]}:${styles.getPropertyValue(styles[i])};`;
    }
    (cloneElements[index] as HTMLElement).style.cssText = cssText;
  });

  return clone;
}

/**
 * 根据坐标查找编辑器中的元素和节点
 */
function findNodeAtPosition({
  x,
  y,
  direction = "right",
  editor
}: {
  x: number;
  y: number;
  direction: "left" | "right";
  editor: any;
}) {
  let resultElement = null;
  let resultNode = null;
  let pos = null;
  let currentX = x;

  while (resultNode === null && currentX > 0 && currentX < window.innerWidth) {
    const elements = document.elementsFromPoint(currentX, y);
    const proseMirrorIndex = elements.findIndex(el =>
      el.classList.contains("ProseMirror")
    );
    const potentialElements = elements.slice(0, proseMirrorIndex);

    if (potentialElements.length > 0) {
      const element = potentialElements[0];
      resultElement = element;
      pos = editor.view.posAtDOM(element, 0);

      if (pos >= 0) {
        resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));
        if (resultNode?.isText) {
          resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));
        }
        resultNode = resultNode || editor.state.doc.nodeAt(Math.max(pos, 0));
        break;
      }
    }

    direction === "left" ? currentX -= 1 : currentX += 1;
  }

  return { resultElement, resultNode, pos };
}

/**
 * 获取元素的计算样式
 */
function getComputedStyleValue(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element)[property as keyof CSSStyleDeclaration] as string;
}

/**
 * 限制数值在最小和最大值之间
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 从DOM中移除元素
 */
function removeElement(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

/**
 * 获取鼠标位置对应的选择范围
 */
function getRangesFromMouseEvent(event: MouseEvent, editor: any) {
  const { doc } = editor.view.state;
  const nodeAtPosition = findNodeAtPosition({
    editor,
    x: event.clientX,
    y: event.clientY,
    direction: "right"
  });

  if (!nodeAtPosition.resultNode || nodeAtPosition.pos === null) {
    return [];
  }

  const { clientX, clientY } = event;
  const coords = {
    left: clamp(
      clientX,
      editor.view.dom.getBoundingClientRect().left +
      parseInt(getComputedStyleValue(editor.view.dom, "paddingLeft"), 10) +
      parseInt(getComputedStyleValue(editor.view.dom, "borderLeftWidth"), 10),
      editor.view.dom.getBoundingClientRect().right -
      parseInt(getComputedStyleValue(editor.view.dom, "paddingRight"), 10) -
      parseInt(getComputedStyleValue(editor.view.dom, "borderRightWidth"), 10)
    ),
    top: clientY
  };

  const posAtCoords = editor.view.posAtCoords(coords);
  if (!posAtCoords) return [];

  const { pos } = posAtCoords;
  if (!doc.resolve(pos).parent) return [];

  const from = doc.resolve(nodeAtPosition.pos);
  const to = doc.resolve(nodeAtPosition.pos + 1);
  return getSelectionRanges(from, to, 0);
}

/**
 * 获取节点的起始位置
 */
function getNodeStartPosition(state: any, pos: number): number {
  const resolvedPos = state.resolve(pos);
  const { depth } = resolvedPos;
  return depth === 0 ? pos : resolvedPos.pos - resolvedPos.parentOffset - 1;
}

/**
 * 获取节点在指定位置的父节点
 */
function getParentNodeAtPos(doc: any, pos: number): any {
  const node = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);
  let { depth } = resolvedPos;
  let parentNode = node;

  while (depth > 0) {
    const ancestor = resolvedPos.node(depth);
    depth -= 1;
    if (depth === 0) {
      parentNode = ancestor;
    }
  }

  return parentNode;
}

/**
 * 获取协作编辑中的相对位置
 */
function getRelativePosition(state: any, pos: number): number | null {
  const yState = ySyncPluginKey.getState(state);
  return yState
    ? absolutePositionToRelativePosition(pos, yState.type, yState.binding.mapping)
    : null;
}

/**
 * 查找编辑器DOM中的元素
 */
function findEditorElement(editorView: any, element: HTMLElement): HTMLElement | null {
  let currentElement = element;
  while (currentElement && currentElement.parentNode && currentElement.parentNode !== editorView.dom) {
    currentElement = currentElement.parentNode as HTMLElement;
  }
  return currentElement;
}

const dragHandlePluginKey = new PluginKey("dragHandle");

/**
 * 拖拽手柄插件
 */
function createDragHandlePlugin({
  pluginKey = dragHandlePluginKey,
  element,
  editor,
  tippyOptions = {},
  onNodeChange
}: {
  pluginKey?: PluginKey;
  element: HTMLElement;
  editor: any;
  tippyOptions?: any;
  onNodeChange?: (params: { editor: any; node: any; pos: number }) => void;
}) {
  const container = document.createElement("div");
  let tippyInstance: any = null;
  let currentNode: any = null;
  let isLocked = false;
  let currentPos = -1;
  let relativePos: number | null = null;

  // 设置拖拽开始事件
  element.addEventListener("dragstart", event => {
    handleDragStart(event, editor);
    setTimeout(() => {
      if (element) {
        element.style.pointerEvents = "none";
      }
    }, 0);
  });

  // 设置拖拽结束事件
  element.addEventListener("dragend", () => {
    if (element) {
      element.style.pointerEvents = "auto";
    }
  });

  /**
   * 处理拖拽开始
   */
  function handleDragStart(event: DragEvent, editor: any) {
    if (!event.dataTransfer) return;

    const { view } = editor;
    const { empty, $from, $to } = view.state.selection;
    const mouseRanges = getRangesFromMouseEvent(event, editor);
    const selectionRanges = getSelectionRanges($from, $to, 0);

    const hasOverlap = selectionRanges.some(range =>
      mouseRanges.find(mouseRange =>
        mouseRange.$from === range.$from && mouseRange.$to === range.$to
      )
    );

    const rangesToUse = empty || !hasOverlap ? mouseRanges : selectionRanges;
    if (!rangesToUse.length) return;

    const { tr } = view.state;
    const dragImage = document.createElement("div");
    const firstPos = rangesToUse[0].$from.pos;
    const lastPos = rangesToUse[rangesToUse.length - 1].$to.pos;
    const nodeSelection = NodeRangeSelection.create(view.state.doc, firstPos, lastPos);
    const selectionContent = nodeSelection.content();

    // 创建拖拽预览图像
    rangesToUse.forEach(range => {
      const nodeClone = cloneNodeWithStyles(view.nodeDOM(range.$from.pos) as HTMLElement);
      dragImage.append(nodeClone);
    });

    dragImage.style.position = "absolute";
    dragImage.style.top = "-10000px";
    document.body.append(dragImage);

    event.dataTransfer.clearData();
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    view.dragging = { slice: selectionContent, move: true };
    tr.setSelection(nodeSelection);
    view.dispatch(tr);

    document.addEventListener("drop", () => removeElement(dragImage), { once: true });
  }

  return new Plugin({
    key: typeof pluginKey === "string" ? new PluginKey(pluginKey) : pluginKey,
    state: {
      init: () => ({ locked: false }),
      apply: (transaction, oldState, _, newState) => {
        const lockMeta = transaction.getMeta("lockDragHandle");
        const hideMeta = transaction.getMeta("hideDragHandle");

        if (lockMeta !== undefined) {
          isLocked = lockMeta;
        }

        if (hideMeta && tippyInstance) {
          tippyInstance.hide();
          isLocked = false;
          currentNode = null;
          currentPos = -1;
          onNodeChange?.({ editor, node: null, pos: -1 });
          return oldState;
        }

        if (transaction.docChanged && currentPos !== -1 && element && tippyInstance) {
          if (isChangeOrigin(transaction)) {
            const newPos = getRelativePosition(newState, currentPos);
            if (newPos !== currentPos) {
              currentPos = newPos || -1;
            }
          } else {
            const mappedPos = transaction.mapping.map(currentPos);
            if (mappedPos !== currentPos) {
              currentPos = mappedPos;
              relativePos = getRelativePosition(newState, currentPos);
            }
          }
        }

        return oldState;
      }
    },
    view: editorView => {
      // 设置拖拽手柄容器
      element.draggable = true;
      element.style.pointerEvents = "auto";
      editor.view.dom.parentElement?.appendChild(container);
      container.appendChild(element);
      container.style.pointerEvents = "none";
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";

      // 初始化 Tippy 实例
      if (!tippyInstance) {
        tippyInstance = tippy(editorView.dom, {
          getReferenceClientRect: null,
          interactive: true,
          trigger: "manual",
          placement: "left-start",
          hideOnClick: false,
          duration: 100,
          popperOptions: {
            modifiers: [
              { name: "flip", enabled: false },
              {
                name: "preventOverflow",
                options: { rootBoundary: "document", mainAxis: false }
              }
            ]
          },
          ...tippyOptions,
          appendTo: container,
          content: element
        });
      }

      return {
        update: (view, prevState) => {
          if (!element) return;
          if (!editor.isEditable) {
            tippyInstance?.destroy();
            tippyInstance = null;
            return;
          }

          // 如果文档没有变化或当前位置无效，则跳过更新
          if (view.state.doc.eq(prevState.doc) || currentPos === -1) {
            return;
          }

          let nodeDOM = view.nodeDOM(currentPos);
          nodeDOM = findEditorElement(view, nodeDOM as HTMLElement);

          if (nodeDOM === view.dom || !nodeDOM || nodeDOM.nodeType !== 1) {
            return;
          }

          const pos = view.posAtDOM(nodeDOM, 0);
          const node = getParentNodeAtPos(editor.state.doc, pos);
          const nodeStartPos = getNodeStartPosition(editor.state.doc, pos);

          currentNode = node;
          currentPos = nodeStartPos;
          relativePos = getRelativePosition(view.state, currentPos);

          onNodeChange?.({ editor, node: currentNode, pos: currentPos });

          tippyInstance.setProps({
            getReferenceClientRect: () => (nodeDOM as HTMLElement).getBoundingClientRect()
          });
        },
        destroy: () => {
          tippyInstance?.destroy();
          if (element) {
            removeElement(container);
          }
        }
      };
    },
    props: {
      handleDOMEvents: {
        mouseleave: (_, event) => {
          if (!isLocked && event.target && !container.contains(event.relatedTarget as Node)) {
            tippyInstance?.hide();
            currentNode = null;
            currentPos = -1;
            onNodeChange?.({ editor, node: null, pos: -1 });
          }
          return false;
        },
        mousemove: (view, event) => {
          if (!element || !tippyInstance || isLocked) return false;

          const nodeAtPosition = findNodeAtPosition({
            x: event.clientX,
            y: event.clientY,
            direction: "right",
            editor
          });

          if (!nodeAtPosition.resultElement) return false;

          let elementAtPos = nodeAtPosition.resultElement as HTMLElement | null;
          elementAtPos = findEditorElement(view, elementAtPos as HTMLElement);

          if (elementAtPos === view.dom || !elementAtPos || elementAtPos.nodeType !== 1) {
            return false;
          }

          const pos = view.posAtDOM(elementAtPos, 0);
          const node = getParentNodeAtPos(editor.state.doc, pos);

          if (node !== currentNode) {
            const nodeStartPos = getNodeStartPosition(editor.state.doc, pos);
            currentNode = node;
            currentPos = nodeStartPos;
            relativePos = getRelativePosition(view.state, currentPos);

            onNodeChange?.({ editor, node: currentNode, pos: currentPos });

            tippyInstance.setProps({
              getReferenceClientRect: () => elementAtPos.getBoundingClientRect()
            });
            tippyInstance.show();
          }

          return false;
        }
      }
    }
  });
}

/**
 * 拖拽手柄扩展
 */
const DragHandle = Extension.create({
  name: "dragHandle",
  addOptions: () => ({
    render: () => {
      const element = document.createElement("div");
      element.classList.add("drag-handle");
      return element;
    },
    tippyOptions: {},
    locked: false,
    onNodeChange: () => null
  }),
  // @ts-ignore
  addCommands() {
    return {
      lockDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = true;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      },
      unlockDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = false;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      },
      toggleDragHandle: () => ({ editor }: { editor: Editor }) => {
        this.options.locked = !this.options.locked;
        return editor.commands.setMeta("lockDragHandle", this.options.locked);
      }
    };
  },
  addProseMirrorPlugins() {
    const element = this.options.render();
    return [
      createDragHandlePlugin({
        tippyOptions: this.options.tippyOptions,
        element,
        editor: this.editor,
        onNodeChange: this.options.onNodeChange
      })
    ];
  }
});

export {
  DragHandle as default,
  DragHandle as DragHandle,
  createDragHandlePlugin as DragHandlePlugin,
  dragHandlePluginKey as dragHandlePluginDefaultKey
};
