import Element from '../element';
import Updater from './updater';
import { PaintConfig, StaleStatus } from '../const/render';
import { updateProps } from './updateCheck';
import { Data, RenderFunction } from '../const/common';
import { setCurrentRenderElement, exitCurrentRenderElement } from '../store/global';

export const canDirectUpdate = (element: Element) => false;

export const signUpdateChain = (leaf: Element, status: StaleStatus) => {
  if (leaf.$.stale !== StaleStatus.Stale) {
    leaf.$.stale = status;
  }
  if (leaf.$.father) {
    leaf.$.father.$.updateRenderFunctions.add(leaf.$.fatherRenderFunctionIndex);
    signUpdateChain(leaf.$.father, StaleStatus.Stale);
  }
};

export const updateElementTree = (element: Element, props?: Data) => {
  /**
   * render function of a Element
   */

  if (props) {
    element.$.props = props;
  }

  // if component is not stale, skip rerender
  if (element.$.stale) {
    // init some props before rendering
    setCurrentRenderElement(element);
    element.$.isAnsysingDependence = true;
    element.$.isCollectingChilds = true;

    const { context } = element;

    let renderList: number[];
    if (!element.$.hasInit) {
      const renderRes = element.render(element);
      element.$.renderFunctions = Array.isArray(renderRes) ? renderRes : [renderRes];
      renderList = [];
      for (let index = 0; index < element.$.renderFunctions.length; index += 1) {
        renderList.unshift(index);
      }
    } else {
      renderList = Array.from(element.$.updateRenderFunctions);
      element.$.updateRenderFunctions?.clear();
    }

    for (let i = renderList.length - 1; i >= 0; i -= 1) {
      const index = renderList[i];
      element.$.currentRenderFunctionIndex = index;
      element.$.useElementIndex = 0;
      element.$.fatherRenderFunctionIndex = element.$.father?.$.currentRenderFunctionIndex || 0;

      const renderFunction = element.$.renderFunctions[index];
      context.save();
      renderFunction(element.context, {
        brush: element.brush,
      });
      context.restore();
    }

    element.$.isAnsysingDependence = false;
    element.$.isCollectingChilds = false;
    element.$.stale = StaleStatus.UnStale;
    element.$.hasInit = true;
    element.$.currentRenderFunctionIndex = -1;
    exitCurrentRenderElement();
  }
};

export const renderTo = (element: Element, target: Element, style: PaintConfig = { x: 0, y: 0 }) => {
  const elementContent = element.$.canvas;
  const targetContext = target.context;
  const { x = 0, y = 0 } = style;
  const PR = element.PR;

  targetContext.save();
  targetContext.translate(x * PR, y * PR);
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
  // is root element
  if (!element.$.father) {
    updateElementTree(element);
    return;
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
