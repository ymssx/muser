import { CanvasElement } from "src/const/common";
import Layer from "src/layer";

export default class Muse {
  layers: Layer[] = [];

  constructor() {}

  createLayer(element: CanvasElement) {
    const layer = new Layer(element);
    this.layers.push(layer);
    return layer;
  }
}
