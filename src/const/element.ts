import { CanvasElement } from './common';

export interface ElementConfig {
  key?: string;
  width: number;
  height: number;
  cache?: boolean; // if use offscreen canvas -- default: true;
  canvas?: CanvasElement | string;
  alpha: boolean; // is canvas transparent -- default: false;
  backgroundColor?: string;
  direct: boolean;
}

export type ElementConfigExtend = Partial<ElementConfig>;

export interface OuterConfig extends ElementConfigExtend {
  key: string;
}
