import Element from '../element';

export interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}
export const haveOverlay = (a: Position, b: Position) => {
  const atRightOrTop = (a: Position, b: Position) => {
    return a.x - b.x >= b.w || a.y - b.y >= b.h;
  };
  return !(atRightOrTop(a, b) || atRightOrTop(b, a));
};

export const getPosition = (element: Element): Position => {
  return {
    x: 0,
    y: 0,
    w: element.config.width,
    h: element.config.height,
  };
};

/**
 * we will obtain a render-tree while traversing the element-tree,
 * which records the coverage relationship between elements.
 */

// preorder traversal
export const DLR = (tree: Element, handler: (element: Element) => boolean) => {
  const hit = handler(tree);
  if (hit) {
    tree.$.childList?.forEach((child) => {
      DLR(child, handler);
    });
  }
};

export const checkOverlay = (element: Element) => {
  if (!element.$.father) return;
  for (const brother of element.$.father.$.childList) {
    if (brother === element) break;
    DLR(brother, (child) => {
      const checkRes = haveOverlay(getPosition(element), getPosition(child));
      if (checkRes) child.$.cover.add(element);
      return checkRes;
    });
  }
};
