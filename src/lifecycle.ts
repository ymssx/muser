import Element from './element';

export default class LifeCycle {
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  start() {
    if (this.element.created instanceof Function) {
      this.element.created();
    }
  }
}
