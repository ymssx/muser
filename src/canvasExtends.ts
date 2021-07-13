import Element from './element';

export default class CanvasProxy {
  element: Element;
  constructor(element: Element) {
    this.element = element;
  }

  paint(props = {}, config = {}) {
    this.element.$paintWithProps(props, config);
    return this;
  }
}
