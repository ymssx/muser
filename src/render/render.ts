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
    element.paint(element);
    element.$.isAnsysingDependence = false;

    context.restore();
    element.$.stale = false;
    element.$.hasInit = true;
  }
};

export const paintTo = (element: Element, target: Element, style: PaintConfig = { x: 0, y: 0 }) => {
  const elementContent = element.$.canvas;
  const targetContext = target.context;
  const { x = 0, y = 0 } = style;
  if (elementContent) {
    targetContext?.drawImage(elementContent, x, y);
  }
};

export const paintToFather = (element: Element, style: PaintConfig = {}) => {
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
  element.$.positionSnapshots.push([[xs, ys], style]);
  element.$.propsSnapshots.push(element.$.props);

  paintTo(element, element.$.father, style);
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
  if (!canDirectUpdate(element)) {
    if (element.$.father) {
      directUpdate(element.$.father);
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
    paintTo(element, target, currentStyle);
  }

  element.$.updater.coverElements.forEach((coverEl) => directUpdate(coverEl));
};
