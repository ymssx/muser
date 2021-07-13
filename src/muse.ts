import { CanvasElement } from './const/common';
import Layer from './layer';

export default class Muse {
  layers: Layer[] = [];

  constructor() {}

  createLayer(element: CanvasElement) {
    const layer = new Layer(element);
    this.layers.push(layer);
    return layer;
  }
}
