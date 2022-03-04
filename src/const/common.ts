export type CanvasElement = OffscreenCanvas | HTMLCanvasElement;

export type Data = { [key: string]: unknown };

export type RenderFunction = (context: CanvasRenderingContext2D) => void;
