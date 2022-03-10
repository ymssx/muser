import { CanvasElement } from './common';

export interface ElementConfig {
  key?: string;
  width: number;
  height: number;
  cache?: boolean; // if use offscreen canvas  -- default: true;
  canvas?: CanvasElement | string;
}

export type ElementConfigExtend = Partial<ElementConfig>;
