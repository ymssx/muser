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

  paint() {
    const paintList: Promise<void>[] = [];
    this.layers.forEach((layer) => {
      paintList.push(layer.$paint());
    });
    return Promise.all(paintList);
  }
}
