import { Data } from './const/common';
import Element from './element';

export default class CanvasProxy {
  element: Element;
  constructor(element: Element) {
    this.element = element;
  }

  rotate({ angle: number = 0 }) {
    return this;
  }

  paint(props: Data = {}) {
    this.element.$paintWithProps(props);
    return this;
  }
}
