import Element from '../element';

export const currentRenderElementStack: Element<Object>[] = [];

export const setCurrentRenderElement = (element: Element<Object>) => {
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
