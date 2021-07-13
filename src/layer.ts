import { CanvasElement } from './const/common';
import { ElementConfig } from './const/element';
import Element from './element';

export default class Layer extends Element {
  public canvas: CanvasElement;

  constructor(canvas: CanvasElement) {
    super();
    this.canvas = canvas;
  }

  directPaint(element: Element, config?: ElementConfig) {}

  addChilds(childs: { [name: string]: Element }) {
    this.childs = childs;
  }
}
