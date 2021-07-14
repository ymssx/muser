import Element from '../element';
import Layer from '../layer';

export default class Updater {
  private layer: Layer;
  private updatePool: Set<Element> = new Set();
  private updateTicket: number | null = null;

  constructor(layer: Layer) {
    this.layer = layer;
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
        this.layer.directPaint(element);
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
