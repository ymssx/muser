import Element from '../element';
import Updater from './updater';

export const canDirectUpdate = (element: Element) => false;

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
    element.paint(element);
    context.restore();
  }
};

export const paintToFather = (element: Element, style: { x?: number; y?: number } = {}) => {
  const elementContent = element.$.canvas;
  const fatherContext = element.$.father?.context;
  const { x = 0, y = 0 } = style;
  if (elementContent) {
    fatherContext?.drawImage(elementContent, x, y);
  }
};

export const directPaint = (element: Element) => {
  paintToFather(element);
  element.$.updater.coverElements.forEach((coverEl) => directPaint(coverEl));
};
