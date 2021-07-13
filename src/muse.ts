import { CanvasElement } from './const/common';
import Layer from './layer';

export default class Muse {
  layers: Layer[] = [];

  constructor() {}

  createLayer(canvas: CanvasElement) {
    const layer = new Layer(canvas);
    this.layers.push(layer);
    return layer;
  }
}
