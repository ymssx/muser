import { Data } from '../const/common';
import { ElementConfigExtend } from '../const/element';
import { PaintConfig } from '../const/render';
import Element from '../element';
import { renderToFather, updateElementTree } from '../render/render';
import { updateProps } from '../render/updateCheck';

export default class ChildProxy {
  element: Element;
  constructor(element: Element) {
    this.element = element;
  }

  rotate({ angle: number = 0 }) {
    return this;
  }

  updateProps(props: Data = {}, config?: ElementConfigExtend) {
    updateProps(this.element, props);
    updateElementTree(this.element);
    return this;
  }

  process(process: (element: Element) => void) {
    this.element.$.processSet.add(process);
    return this;
  }

  slot(process: (element: Element) => void, name: string = 'default') {
    this.element.$.slotsMap.set(name, process);
    return this;
  }

  paste(style: PaintConfig) {
    renderToFather(this.element, style);
    return this;
  }
}

export const addChildList = (element: Element, child: Element) => {
  const currentChildList = element.$.childList;
  currentChildList.unshift(child);
  element.$.childList = Array.from(new Set(currentChildList));
};
