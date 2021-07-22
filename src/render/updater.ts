import Element from '../element';
import { updateElementTree } from './render';

export default class Updater {
  private element: Element;
  private updatePool: Set<Element> = new Set();
  public coverElements: Set<Element> = new Set();
  private ticket: number | null = null;

  constructor(element: Element) {
    this.element = element;
  }

  add(element: Element) {
    this.updatePool.add(element);
    this.registUpdate();
  }

  addCoverElement(element: Element) {
    this.coverElements.add(element);
  }

  update() {
    this.updatePool.forEach((element) => {});
    this.updatePool.clear();
  }

  directUpdate() {}

  registUpdate() {
    if (this.ticket) cancelAnimationFrame(this.ticket);
    this.ticket = requestAnimationFrame(this.update);
  }
}
