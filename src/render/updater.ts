import { getLastAbsolutePosition } from '../utils/element';
import Element from '../element';
import { canDirectUpdate, directUpdate } from './render';

export default class Updater {
  private element: Element;
  private updatePool: Set<Element> = new Set();
  public coverElements: Set<Element> = new Set();
  public ticket: number | null = null;

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
    const [x = 0, y = 0] = getLastAbsolutePosition(this.element);
    directUpdate(this.element, { x, y });
    this.ticket = null;
  }

  registUpdate() {
    if (this.ticket) cancelAnimationFrame(this.ticket);
    this.ticket = requestAnimationFrame(() => this.update());
  }
}
