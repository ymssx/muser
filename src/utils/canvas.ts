import { CanvasElement } from 'src/const/common';

export const createCanvas = (width: number, height: number): CanvasElement => {
  if (OffscreenCanvas) {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};
