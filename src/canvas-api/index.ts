import Element from '../element';
import { transPr } from './pr';

type P = number | string;

type Position = P[];

interface RenderStyle {
  font?: CanvasRenderingContext2D['font'];
  globalAlpha?: CanvasRenderingContext2D['globalAlpha'];
  globalCompositeOperation?: CanvasRenderingContext2D['globalCompositeOperation'];
  imageSmoothingEnabled?: CanvasRenderingContext2D['imageSmoothingEnabled'];
  imageSmoothingQuality?: CanvasRenderingContext2D['imageSmoothingQuality'];
  lineCap?: CanvasRenderingContext2D['lineCap'];
  lineDashOffset?: CanvasRenderingContext2D['lineDashOffset'];
  lineJoin?: CanvasRenderingContext2D['lineJoin'];
  lineWidth?: CanvasRenderingContext2D['lineWidth'];
  miterLimit?: CanvasRenderingContext2D['miterLimit'];
  shadowBlur?: CanvasRenderingContext2D['shadowBlur'];
  shadowColor?: CanvasRenderingContext2D['shadowColor'];
  shadowOffsetX?: CanvasRenderingContext2D['shadowOffsetX'];
  shadowOffsetY?: CanvasRenderingContext2D['shadowOffsetY'];
  strokeStyle?: CanvasRenderingContext2D['strokeStyle'];
  textAlign?: CanvasRenderingContext2D['textAlign'];
  textBaseline?: CanvasRenderingContext2D['textBaseline'];
  fillStyle?: CanvasRenderingContext2D['fillStyle'];
}

export default class Brush {
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  get context() {
    return this.element.context;
  }

  get ctx() {
    return this.context;
  }

  get canvas() {
    return this.element.canvas;
  }

  getSizeOfWidth(x: P) {
    if (x === undefined) {
      return x;
    }
    const PR = window.devicePixelRatio;

    let size = x;
    if (typeof x === 'string') {
      const number = parseFloat(x);
      if (x.length && x[x.length - 1] === '%') {
        size = ((this.element.config.width || 0) * number) / 100;
      } else {
        size = number;
      }
    }
    return Number(size) * PR;
  }

  getSizeOfHeight(y: P) {
    if (y === undefined) {
      return y;
    }
    const PR = window.devicePixelRatio;

    let size = y;
    if (typeof y === 'string') {
      const number = parseFloat(y);
      if (y.length && y[y.length - 1] === '%') {
        size = ((this.element.config.height || 0) * number) / 100;
      } else {
        size = number;
      }
    }
    return Number(size) * PR;
  }

  setStyle(style: RenderStyle = {}) {
    for (const key in style) {
      const value = style[key as keyof RenderStyle];
      const newValue = typeof value === 'string' ? transPr(value) : value;
      if ((this.ctx as any)[key] !== newValue) {
        (this.ctx as any)[key] = newValue;
      }
    }
  }

  renderWithStyle(style: RenderStyle, renderFunction: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = this.element.context;
    ctx.save();
    this.setStyle(style);
    renderFunction(ctx);
    ctx.restore();
  }

  clear() {
    this.element.canvas.width = this.element.canvas.width;
  }

  rect([x, y, w, h]: Position, style: RenderStyle) {
    this.renderWithStyle(style, (ctx) => {
      ctx.fillRect(this.getSizeOfWidth(x), this.getSizeOfHeight(y), this.getSizeOfWidth(w), this.getSizeOfHeight(h));
    });
  }

  text(text: string, [x, y, w]: Position, style: RenderStyle) {
    this.renderWithStyle(style, (ctx) => {
      ctx.fillText(text, this.getSizeOfWidth(x), this.getSizeOfHeight(y), this.getSizeOfWidth(w));
    });
  }

  line(line: Position, style: RenderStyle) {
    this.lines([line], style);
  }

  lines(lines: Position[], style: RenderStyle) {
    this.renderWithStyle(style, (ctx) => {
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of lines) {
        ctx.moveTo(this.getSizeOfWidth(x1), this.getSizeOfHeight(y1));
        ctx.lineTo(this.getSizeOfWidth(x2), this.getSizeOfHeight(y2));
      }
      ctx.stroke();
      ctx.closePath();
    });
  }

  poly(points: Position[], style: RenderStyle) {
    this.renderWithStyle(style, (ctx) => {
      ctx.beginPath();

      const [x1, y1] = points[0];
      ctx.moveTo(this.getSizeOfWidth(x1), this.getSizeOfHeight(y1));

      for (let index = 1; index < points.length; index += 1) {
        const [x, y] = points[index];
        ctx.lineTo(this.getSizeOfWidth(x), this.getSizeOfHeight(y));
      }

      ctx.lineTo(this.getSizeOfWidth(x1), this.getSizeOfHeight(y1));

      ctx.fill();
      ctx.beginPath();
    });
  }
}
