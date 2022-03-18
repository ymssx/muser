import Element from './element';

export default class LifeCycle {
  element: Element<Object>;

  constructor(element: Element<Object>) {
    this.element = element;
  }

  start() {
    if (this.element.created instanceof Function) {
      this.element.created();
    }
  }
}
