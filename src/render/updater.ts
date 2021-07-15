import Element from '../element';
import { updateElementTree } from './render';

export default class Updater {
  private element: Element;
  private updatePool: Set<Element> = new Set();
  private ticket: number | null = null;

  constructor(element: Element) {
    this.element = element;
  }

  add(element: Element) {
    this.updatePool.add(element);
    this.registUpdate();
  }

  registUpdate() {
    if (this.ticket) {
      cancelAnimationFrame(this.ticket);
    }
    this.ticket = requestAnimationFrame(() => {
      this.updatePool.forEach((element) => {
        updateElementTree(element);
        this.element.$directPaint(element);
      });
      this.updatePool.clear();
    });
  }
}
