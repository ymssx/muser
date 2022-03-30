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

export const initCanvas = (element: Element): CanvasElement | null => {
  const { cache, alpha, backgroundColor } = element.config || {};
  if (!cache) {
    return null;
  }

  let canvas: CanvasElement;
  if (typeof element.config.canvas === 'string') {
    if (env === ENV.worker) {
      // TODO
      element.$.canvasName = element.config.canvas;
      canvas = createCanvas(element.config.width, element.config.height);
    } else {
      throw new Error('Only in worker mode, type of "canvas" can be string');
    }
  } else {
    canvas = element.config.canvas
      ? bindCanvas(element.config.canvas, element.config.width, element.config.height)
      : createCanvas(element.config.width, element.config.height);
  }

  if (!alpha && backgroundColor) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }

  return canvas;
};
