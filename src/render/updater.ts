import Element from '../element';
import { signUpdateChain, directUpdate, canDirectUpdate, updateElementTree, collectDirectRender } from './render';
import { StaleStatus } from '../const/render';

export default class Updater {
  private element: Element;
  private updatePool: Set<Element> = new Set();
  public coverElements: Set<Element> = new Set();
  public ticket: number | null = null;
  public needDirectRender = false;

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

  beginUpdate() {
    this.ticket = null;
    collectDirectRender(this.element);
  }

  registUpdate() {
    if (this.ticket) cancelAnimationFrame(this.ticket);
    this.ticket = requestAnimationFrame(() => this.beginUpdate());
  }

  update() {
    let updateRoot = this.element;
    while (!canDirectUpdate(updateRoot) && updateRoot.$.father) {
      updateRoot = updateRoot.$.father;
    }
    updateRoot.$.updater.needDirectRender = true;
    signUpdateChain(this.element, StaleStatus.Updater, updateRoot);
    (this.element.$.root?.$.updater || this).registUpdate();
  }
}
