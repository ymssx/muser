import Element from './element';
import { createCanvas } from './utils/canvas';

export namespace LifeCycle {
  const defaultBeforeCreated = (element: Element) => {
    const { width, height } = element.config;
    element.canvas = createCanvas(width, height);
  };
}
