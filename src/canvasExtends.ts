import type Element from 'src/element';

export default class CanvasProxy {
  element: Element;
  constructor(element: Element) {
    this.element = element;
  }

  paint() {
    return this;
  }
}