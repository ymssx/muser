import Element from '../element';
import { PaintConfig, StaleStatus } from '../const/render';
import { updateProps } from './updateCheck';
import { Data, RenderFunction } from '../const/common';
import { setCurrentRenderElement, exitCurrentRenderElement } from '../store/global';

export const canDirectUpdate = (element: Element<Object>) => true;

export const signUpdateChain = (leaf: Element<Object>, status: StaleStatus, end?: Element<Object>) => {
  if (leaf.$.stale !== StaleStatus.Updater) {
    leaf.$.stale = status;
  }
  if (leaf === end) {
    return;
  }
  if (leaf.$.father) {
    leaf.$.father.$.updateRenderFunctions.add(leaf.$.fatherRenderFunctionIndex);

    signUpdateChain(leaf.$.father, StaleStatus.Stale, end);
  }
};

export const updateElementTree = (element: Element<Object>, props?: Data) => {
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
      if (renderFunction) {
        renderFunction(element.brush);
      }
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

export const renderTo = (element: Element<Object>, target: Element<Object>, style: PaintConfig = { x: 0, y: 0 }) => {
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

export const renderToFather = (element: Element<Object>, style: PaintConfig = {}) => {
  if (!element.$.father) {
    throw new Error(`Element don't have a father element`);
  }

  /**
   * 记录每次被渲染时，当前组件链的相对位置、props
   * 为了在直接渲染时快速找到上次的位置与props
   */
  // TODO: 需要找到时机清空
  element.$.positionSnapshots.push(style);
  element.$.propsSnapshots.push(element.$.props);

  renderTo(element, element.$.father, style);
};

export const getTargetPosition = (target: Element<Object>): { x: number; y: number }[] => {
  const father = target?.$.father;
  if (!target || !father) {
    return [{ x: 0, y: 0 }];
  }

  const res = [];
  const styles = target.$.positionSnapshots;
  const fatherPositions = getTargetPosition(father);
  for (const position of fatherPositions) {
    for (const { x = 0, y = 0 } of styles) {
      res.push({
        x: position.x + x,
        y: position.y + y,
      });
    }
  }
  return res;
};

export const directUpdate = (element: Element<Object>, target: Element<Object>) => {
  // is root element
  if (!element.$.father) {
    updateElementTree(element);
    return;
  }

  for (let index = 0; index < element.$.positionSnapshots.length; index += 1) {
    const props = element.$.propsSnapshots[index];
    updateProps(element, props);
    updateElementTree(element);

    const style = element.$.positionSnapshots[index];
    const { x = 0, y = 0 } = style;
    const positions = getTargetPosition(element.$.father);
    positions.forEach((item) => {
      const currentStyle = {
        ...style,
        x: x + item.x,
        y: y + item.y,
      };
      renderTo(element, target, currentStyle);
    });
  }

  element.$.updater.coverElements.forEach((coverEl) => directUpdate(coverEl, target));
};

export const renderToNewCanvas = (element: Element<Object>, newCanvas: OffscreenCanvas) => {
  element.canvas = newCanvas;
};

export const renderSlot = (element: Element<Object>, name: string = 'default') => {
  const process = element.$.slotsMap.get(name);
  if (process instanceof Function) {
    element.context.save();
    process(element);
    element.context.restore();
  }
};

const iteratorElement = (element: Element<Object>) => {
  let list: Array<Element<Object>> = [element];
  return {
    [Symbol.iterator]() {
      return {
        next() {
          if (list.length === 0) {
            return { done: true };
          }

          const current = list.pop() as Element<Object>;
          if (current.$.childList) {
            list = list.concat(current.$.childList);
          }
          return {
            value: current,
            done: false,
          };
        },
      };
    },
  };
};

export const collectDirectRender = (root: Element<Object> | null) => {
  if (!root) {
    return;
  }

  const elementList = iteratorElement(root);
  const directList = [];
  for (const element of elementList) {
    if (element?.$.updater.needDirectRender) {
      directUpdate(element, root);
      element.$.updater.needDirectRender = false;
      directList.push(element);
    }
  }

  for (const element of directList) {
    signUpdateChain(element, StaleStatus.Stale);
  }
};
