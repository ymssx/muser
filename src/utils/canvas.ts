import { CanvasElement } from '../const/common';

export const createCanvas = (width: number, height: number): CanvasElement => {
  if (window?.OffscreenCanvas) {
    return new window.OffscreenCanvas(width, height);
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
