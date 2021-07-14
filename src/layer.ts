import { CanvasElement } from './const/common';
import { ElementConfig } from './const/element';
import Element from './element';

export default class Layer extends Element {
  constructor(canvas: CanvasElement) {
    super();
    this.canvas = canvas;
  }

  directPaint(element: Element, config?: ElementConfig) {}

  addChilds(childMap: { [name: string]: Element }) {
    this.childMap = childMap;
  }
}
