import Element from '../element';

export interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}
export const haveIntersection = (a: Position, b: Position) => {
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

export default class RenderTree {
  childs: Element[] = [];
  add(element: Element) {
    this.childs.push(element);
  }
}

/**
 * preorder traversal
 */
const DLR = (tree: Element, handler: (element: Element) => boolean) => {
  handler(tree);
  tree.$.childList.forEach((child) => {
    DLR(child, handler);
  });
};

/**
 * postorder traversal
 */
const LRD = (element: Element, handler: (element: Element) => boolean): boolean => {
  let stop = false;
  element.$.renderTree.childs.forEach((child) => {
    stop = stop || LRD(child, handler);
  });
  if (!stop) {
    stop = stop || handler(element);
  }
  return stop;
};

/**
 * we will obtain a render-tree while traversing the element-tree,
 * which records the coverage relationship between elements.
 */
export const mountRenderTree = (element: Element) => {
  if (!element.$.father) return;
  LRD(element.$.father, (child) => {
    const checkRes = haveIntersection(getPosition(element), getPosition(child));
    if (checkRes) {
      child.$.renderTree.add(element);
    }
    return checkRes;
  });
};
