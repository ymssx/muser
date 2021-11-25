import Element from '../element';
import Updater from './updater';
import { PaintConfig } from '../const/render';
import { updateProps } from './updateCheck';

export const canDirectUpdate = (element: Element) => true;

export const signUpdateChain = (leaf: Element, updater: Updater) => {
  leaf.$.stale = true;
  if (canDirectUpdate(leaf)) {
    updater.add(leaf);
  } else if (leaf.$.father) {
    signUpdateChain(leaf.$.father, updater);
  }
};

export const updateElementTree = (element: Element) => {
  // if component is not stale, skip rerender
  if (element.$.stale) {
    const { context } = element;
    context.save();

    element.$.isAnsysingDependence = true;
    element.render(element);
    element.$.isAnsysingDependence = false;

    context.restore();
    element.$.stale = false;
    element.$.hasInit = true;
  }
};

export const renderTo = (element: Element, target: Element, style: PaintConfig = { x: 0, y: 0 }) => {
  const elementContent = element.$.canvas;
  const targetContext = target.context;
  const { x = 0, y = 0 } = style;

  targetContext.save();
  targetContext.translate(x, y);
  if (elementContent) targetContext?.drawImage(elementContent, 0, 0); // 主绘制逻辑
  element.$.processSet.forEach((process) => process(target)); // 后处理
  targetContext.restore();

  element.$.processSet.clear();
};

export const renderToFather = (element: Element, style: PaintConfig = {}) => {
  if (!element.$.father) {
    throw new Error(`Element don't have a father element`);
  }

  /**
   * 记录每次被渲染时，当前组件链的相对位置、props
   * 为了在直接渲染时快速找到上次的位置与props
   */
  const { x = 0, y = 0 } = style;
  const [xs, ys] = element.$.father.$.currentPosition;
  element.$.currentPosition = [
    [...xs, x],
    [...ys, y],
  ];
  // 仅在一个主任务中收集，下次任务开始前清空
  if (!element.$.snapFlag) {
    element.$.snapFlag = true;
    element.$.positionSnapshots = [];
    element.$.propsSnapshots = [];
    setTimeout(() => {
      element.$.snapFlag = false;
    }, 0);
  }
  element.$.positionSnapshots.push([[xs, ys], style]);
  element.$.propsSnapshots.push(element.$.props);

  renderTo(element, element.$.father, style);
};

export const getTargetPosition = (target: Element, list: [number[], number[]]): [number, number] => {
  const floor = target.$.floor;
  let x = 0;
  let y = 0;
  for (let index = 0; index < floor; index += 1) {
    x += list[0][index];
    y += list[1][index];
  }
  return [x, y];
};

export const getPaintTarget = (element: Element): Element => {
  const father = element.$.father;
  if (father) {
    if (father.$.updater.ticket) {
      return father;
    } else {
      return getPaintTarget(father);
    }
  } else {
    return element;
  }
};

export const directUpdate = (element: Element) => {
  // root element
  if (!element.$.father) {
    updateElementTree(element);
    return;
  }

  if (!canDirectUpdate(element)) {
    if (element.$.father) {
      directUpdate(element.$.father);
      return;
    }
  }

  const target = getPaintTarget(element);
  for (let index = 0; index < element.$.positionSnapshots.length; index += 1) {
    const props = element.$.propsSnapshots[index];
    updateProps(element, props);
    updateElementTree(element);

    const [list, style] = element.$.positionSnapshots[index];
    const { x = 0, y = 0 } = style;
    const [tx, ty] = getTargetPosition(target, list);
    const currentStyle = {
      ...style,
      x: tx + x,
      y: ty + y,
    };
    renderTo(element, target, currentStyle);
  }

  element.$.updater.coverElements.forEach((coverEl) => directUpdate(coverEl));
};

export const renderToNewCanvas = (element: Element, newCanvas: OffscreenCanvas) => {
  element.canvas = newCanvas;
};

export const renderSlot = (element: Element, name: string = 'default') => {
  const process = element.$.slotsMap.get(name);
  if (process instanceof Function) {
    element.context.save();
    process(element);
    element.context.restore();
  }
};
