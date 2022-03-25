import { Brush } from '../canvas-api/index';

export type CanvasElement = OffscreenCanvas | HTMLCanvasElement;

export type Data = { [key: string]: unknown };

export type RenderFunction = (brush: Brush) => void;
