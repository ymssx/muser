import { CanvasElement } from '../const/common';
import Element from '../element';
import env, { ENV } from './env';

export const createCanvas = (width: number, height: number): CanvasElement => {
  if (OffscreenCanvas) {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export const bindCanvas = (canvas: CanvasElement, width: number, height: number): CanvasElement => {
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export const initCanvas = (element: Element): CanvasElement => {
  if (typeof element.config.canvas === 'string') {
    if (env === ENV.worker) {
      // TODO
      element.$.canvasName = element.config.canvas;
      return createCanvas(element.config.width, element.config.height);
    } else {
      throw new Error('Only in worker mode, type of "canvas" can be string');
    }
  }

  return element.config.canvas
    ? bindCanvas(element.config.canvas, element.config.width, element.config.height)
    : createCanvas(element.config.width, element.config.height);
};
