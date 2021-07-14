import { CanvasElement } from './common';

export interface ElementConfig {
  width: number;
  height: number;
  cache?: boolean; // if use offscreen canvas  -- default: true;
  canvas?: CanvasElement;
}

export type ElementConfigExtend = Partial<ElementConfig>;
