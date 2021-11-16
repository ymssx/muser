import { Data } from './const/common';
import { ElementConfigExtend } from './const/element';
import Element from './element';
import { paintToFather } from './render/render';
import { updateProps } from './utils/element';

interface PasteConfig {
  x: number;
  y: number;
}
export default class CanvasProxy {
  element: Element;
  constructor(element: Element) {
    this.element = element;
  }

  rotate({ angle: number = 0 }) {
    return this;
  }

  updateProps(props: Data = {}, config?: ElementConfigExtend) {
    updateProps(this.element, props);
    if (this.element.$.stale) {
      const { context } = this.element;
      context.save();
      this.element.paint(this.element);
      context.restore();
    }
    return this;
  }

  paste(style: PasteConfig) {
    paintToFather(this.element, style);
    return this;
  }
}
