import Element from '../element';

export const currentRenderElementStack: Element[] = [];

export const setCurrentRenderElement = (element: Element) => {
  currentRenderElementStack.push(element);
};

export const getCurrentRenderElement = () => {
  const len = currentRenderElementStack.length;
  if (!len) {
    return null;
  }
  return currentRenderElementStack[len - 1];
};

export const exitCurrentRenderElement = () => {
  currentRenderElementStack.pop();
};
