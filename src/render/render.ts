import Element from '../element';
import Updater from './updater';
import { PaintConfig } from '../const/render';

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

  const { x = 0, y = 0 } = style;
  element.$.status.lastPaintRelativePosition = [x, y];

  paintTo(element, element.$.father, style);
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

export const directUpdate = (element: Element, style?: PaintConfig) => {
  if (!canDirectUpdate(element)) {
    if (element.$.father) {
      directUpdate(element.$.father, style);
    }
  }

  updateElementTree(element);
  const target = getPaintTarget(element);
  paintTo(element, target, style);

  element.$.updater.coverElements.forEach((coverEl) => directUpdate(coverEl));
};
