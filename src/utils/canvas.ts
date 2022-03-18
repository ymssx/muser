import { CanvasElement } from '../const/common';
import Element from '../element';
import env, { ENV } from './env';

export const createCanvas = (width: number, height: number): CanvasElement => {
  const PR = window.devicePixelRatio;
  if (OffscreenCanvas) {
    return new OffscreenCanvas(width * PR, height * PR);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width * PR;
  canvas.height = height * PR;
  return canvas;
};

export const bindCanvas = (canvas: CanvasElement, width: number, height: number): CanvasElement => {
  const PR = window.devicePixelRatio;
  canvas.width = width * PR;
  canvas.height = height * PR;
  if (canvas instanceof HTMLCanvasElement) {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }
  return canvas;
};

export const initCanvas = (element: Element<Object>): CanvasElement | null => {
  if (!element.config?.cache) {
    return null;
  }

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
