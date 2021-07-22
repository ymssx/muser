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

export const updateElementTree = (root: Element) => {
  // if conponent is not stale, skip rerender
  if (!root.$.stale) {
    return;
  }

  root.$.childList.forEach((element) => {
    updateElementTree(element);
  });
  root.paint();
};

const paintToFather = (element: Element) => {};

export const directPaint = (element: Element) => {
  paintToFather(element);
  element.$.updater.coverElements.forEach((coverEl) => directPaint(coverEl));
};
