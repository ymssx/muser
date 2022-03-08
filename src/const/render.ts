export interface PaintConfig {
  x?: number;
  y?: number;
}

export enum StaleStatus {
  Stale = 1,
  Updater = -1,
  UnStale = 0,
}
