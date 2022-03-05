import Element from '../element';
import { Data } from '../const/common';
import { bindElements } from '../utils/element';
import { ElementConfig } from '../const/element';
import { getCurrentRenderElement } from '../store/global';
import ChildProxy from '../render/child';

interface UseElementConfig extends ElementConfig {
  key?: string;
}

export const useElement = (ElementClass: { new (config: ElementConfig): Element }, config: UseElementConfig) => {
  const currentElement = getCurrentRenderElement();
  if (!currentElement) {
    throw new Error('no Element is Rendering');
  }

  let elementName;
  if (!config.key) {
    console.warn(
      `[Muser Warning]: we suggest to set 'key' in 'config' while you're using 'useElement()', or it might make mistakes when you use it in 'if' or 'for' section`
    );

    const currentRenderFunctionIndex = currentElement.$.currentRenderFunctionIndex;
    const currentElementIndex = currentElement.$.useElementIndex;
    elementName = `__private_child_${currentRenderFunctionIndex}_${currentElementIndex}__`;
  } else {
    elementName = config.key;
  }

  if (!currentElement.$.elPainterMap[elementName]) {
    const element = new ElementClass(config);
    currentElement.$.childMap[elementName] = element;
    bindElements(currentElement, element);
    const child = new ChildProxy(element);
    currentElement.$.elPainterMap[elementName] = child.updateProps.bind(child);

    if (currentElement.$.isCollectingChilds) {
      currentElement.$.childList.unshift(element);
    }
  }

  currentElement.$.useElementIndex += 1;
  return currentElement.$.elPainterMap[elementName];
};
