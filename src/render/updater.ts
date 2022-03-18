import Element from '../element';
import { signUpdateChain, directUpdate, canDirectUpdate, updateElementTree } from './render';
import { StaleStatus } from '../const/render';

export default class Updater {
  private element: Element<Object>;
  private updatePool: Set<Element<Object>> = new Set();
  public coverElements: Set<Element<Object>> = new Set();
  public ticket: number | null = null;

  constructor(element: Element<Object>) {
    this.element = element;
  }

  add(element: Element<Object>) {
    this.updatePool.add(element);
    this.registUpdate();
  }

  addCoverElement(element: Element<Object>) {
    this.coverElements.add(element);
  }

  beginUpdate() {
    updateElementTree(this.element);
    directUpdate(this.element);
    this.ticket = null;
  }

  registUpdate() {
    if (this.ticket) cancelAnimationFrame(this.ticket);
    this.ticket = requestAnimationFrame(() => this.beginUpdate());
  }

  update() {
    signUpdateChain(this.element, StaleStatus.Updater);

    let updateRoot = this.element;
    while (!canDirectUpdate(updateRoot) && updateRoot.$.father) {
      updateRoot = updateRoot.$.father;
    }
    updateRoot.$.updater.registUpdate();
  }
}
