import { CanvasElement } from "src/const/common";
import Element from "src/element";

export default class Layer {
  public canvas: CanvasElement;
  constructor(canvas: CanvasElement) {
    this.canvas = canvas;
  }

  directPaint(element: Element) {}
}
