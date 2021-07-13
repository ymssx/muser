export interface ElementConfig {
  width: number;
  height: number;
  cache: boolean; // if use offscreen canvas  -- default: true;
}

export type ElementConfigExtend = Partial<ElementConfig>;
