import { CanvasElement, Data } from './const/common';
import { ElementConfig } from './const/element';
import Layer from './layer';

export default class Muse {
  layers: Layer[] = [];

  constructor() {}

  createLayer(canvas: CanvasElement, props: Data, config: ElementConfig) {
    const layer = new Layer(props, config, canvas);
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
