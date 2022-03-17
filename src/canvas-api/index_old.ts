import { CanvasElement } from '../const/common';
import Element from '../element';

const apis: {
  [key: string]: Function;
} = {};

export class CanvasProxy {
  canvas: CanvasElement;

  constructor(canvas: CanvasElement) {
    this.canvas = canvas;
  }

  getContext() {
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('get context failed');
    }

    const self = this;

    return new Proxy(context, {
      get(context, key: string) {
        if (apis[key]) {
          if (apis[key] instanceof Function) {
            return apis[key].bind(self);
          } else {
            return apis[key];
          }
        } else if (key in context) {
          return (context as { [key: string]: any })[key];
        }
      },
      set(context, key: string, value) {
        (context as { [key: string]: any })[key] = value;
        return true;
      },
    });
  }
}
