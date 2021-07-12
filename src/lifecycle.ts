import type Element from 'src/element';
import { createCanvas } from 'src/utils/canvas';

export namespace LifeCycle {
  const defaultBeforeCreated = (element: Element) => {
    const { width, height } = element.config;
    element.canvas = createCanvas(width, height);
  }
}
