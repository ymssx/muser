import { CanvasElement } from '../const/common';

export const createCanvas = (width: number, height: number): CanvasElement => {
  if (window?.OffscreenCanvas) {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};
