import { CanvasElement } from './const/common';
import Element from './element';

export default class Layer {
  public canvas: CanvasElement;
  constructor(canvas: CanvasElement) {
    this.canvas = canvas;
  }

  directPaint(element: Element) {}
}
