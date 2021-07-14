import Element from '../element';

export default class Updater {
  private element: Element;
  private updatePool: Set<Element> = new Set();
  private updateTicket: number | null = null;

  constructor(element: Element) {
    this.element = element;
  }

  add(element: Element) {
    this.updatePool.add(element);
    this.registUpdate();
  }

  registUpdate() {
    if (this.updateTicket) {
      cancelAnimationFrame(this.updateTicket);
    }
    this.updateTicket = requestAnimationFrame(() => {
      this.updatePool.forEach((element) => {
        updateElementTree(element);
        this.element.$directPaint(element);
      });
      this.updatePool.clear();
    });
  }
}

export const rigistUpdate = () => {};

export const canDirectUpdate = (element: Element) => false;

export const signUpdateChain = (leaf: Element, updater: Updater) => {
  leaf.$.stale = true;
  if (canDirectUpdate(leaf)) {
    updater.add(leaf);
  } else if (leaf.$.father) {
    signUpdateChain(leaf.$.father, updater);
  }
};

export const updateElementTree = (root: Element) => {
  // if conponent is not stale, skip rerender
  if (!root.$.stale) {
    return;
  }

  root.$.childList.forEach((element) => {
    updateElementTree(element);
  });

  root.$paint();
};
