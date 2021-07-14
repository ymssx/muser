import { CanvasElement, Data } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import Element from './element';
import Updater from './utils/update';
import { bindElementsLayer } from './utils/element';

export default class Layer extends Element {
  updater: Updater = new Updater(this);

  // constructor(props: Data, config: ElementConfig, canvas: CanvasElement) {
  //   super(props, config, canvas);
  // }

  directPaint(element: Element, config?: ElementConfig) {}

  addChilds(childMap: { [name: string]: Element }) {
    bindElementsLayer(childMap, this);
    this.childMap = childMap;
  }
}
