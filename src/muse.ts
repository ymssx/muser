import { CanvasElement } from './const/common';
import { ElementConfigExtend } from './const/element';
import Layer from './layer';

export default class Muse {
  layers: Layer[] = [];

  constructor() {}

  createLayer(canvas: CanvasElement, config: ElementConfigExtend) {
    const layer = new Layer(canvas);
    this.layers.push(layer);
    return layer;
  }
}
