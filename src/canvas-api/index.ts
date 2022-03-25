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

export default function getBrush(element: Element<Object>) {
  const PR = window.devicePixelRatio;

  const setStyle = function (style: RenderStyle = {}) {
    for (const key in style) {
      const value = style[key as keyof RenderStyle];
      const newValue = typeof value === 'string' ? transPr(value) : value;
      if ((element.context as any)[key] !== newValue) {
        (element.context as any)[key] = newValue;
      }
    }
  };

  const getSizeOfWidth = function (x: P) {
    if (x === undefined) {
      return x;
    }

    let size = x;
    if (typeof x === 'string') {
      const number = parseFloat(x);
      if (x.length && x[x.length - 1] === '%') {
        size = ((element.config.width || 0) * number) / 100;
      } else {
        size = number;
      }
    }
    return Number(size) * PR;
  };

  const getSizeOfHeight = function (y: P) {
    if (y === undefined) {
      return y;
    }

    let size = y;
    if (typeof y === 'string') {
      const number = parseFloat(y);
      if (y.length && y[y.length - 1] === '%') {
        size = ((element.config.height || 0) * number) / 100;
      } else {
        size = number;
      }
    }
    return Number(size) * PR;
  };

  const renderWithStyle = function <T>(style: RenderStyle, renderFunction: (ctx: CanvasRenderingContext2D) => T) {
    const ctx = element.context;
    ctx.save();
    setStyle(style);
    const res = renderFunction(ctx);
    ctx.restore();
    return res;
  };

  return {
    get context() {
      return element.context;
    },

    get ctx() {
      return element.context;
    },

    get canvas() {
      return element.canvas;
    },

    clear() {
      element.canvas.width = element.canvas.width;
    },

    clearRect([x, y, w, h]: Position) {
      element.context.clearRect(getSizeOfWidth(x), getSizeOfHeight(y), getSizeOfWidth(w), getSizeOfHeight(h));
    },

    rect([x, y, w, h]: Position, style: RenderStyle) {
      renderWithStyle(style, (ctx) => {
        const { fillStyle, strokeStyle } = style;
        if (fillStyle) {
          ctx.fillRect(getSizeOfWidth(x), getSizeOfHeight(y), getSizeOfWidth(w), getSizeOfHeight(h));
        }
        if (strokeStyle) {
          ctx.strokeRect(getSizeOfWidth(x), getSizeOfHeight(y), getSizeOfWidth(w), getSizeOfHeight(h));
        }
      });
    },

    text(text: string, [x, y, w]: Position, style: RenderStyle) {
      renderWithStyle(style, (ctx) => {
        ctx.fillText(text, getSizeOfWidth(x), getSizeOfHeight(y), getSizeOfWidth(w));
      });
    },

    line([x1, y1, x2, y2]: Position, style: RenderStyle) {
      renderWithStyle(style, (ctx) => {
        ctx.beginPath();
        ctx.moveTo(getSizeOfWidth(x1), getSizeOfHeight(y1));
        ctx.lineTo(getSizeOfWidth(x2), getSizeOfHeight(y2));
        ctx.stroke();
        ctx.closePath();
      });
    },

    lines(lines: Position[], style: RenderStyle) {
      renderWithStyle(style, (ctx) => {
        ctx.beginPath();
        for (const [x1, y1, x2, y2] of lines) {
          ctx.moveTo(getSizeOfWidth(x1), getSizeOfHeight(y1));
          ctx.lineTo(getSizeOfWidth(x2), getSizeOfHeight(y2));
        }
        ctx.stroke();
        ctx.closePath();
      });
    },

    poly(points: Position[], style: RenderStyle) {
      renderWithStyle(style, (ctx) => {
        ctx.beginPath();

        const [x1, y1] = points[0];
        ctx.moveTo(getSizeOfWidth(x1), getSizeOfHeight(y1));

        for (let index = 1; index < points.length; index += 1) {
          const [x, y] = points[index];
          ctx.lineTo(getSizeOfWidth(x), getSizeOfHeight(y));
        }

        ctx.lineTo(getSizeOfWidth(x1), getSizeOfHeight(y1));

        ctx.fill();
        ctx.beginPath();
      });
    },

    measure(text: string, style: RenderStyle) {
      return renderWithStyle(style, (ctx) => {
        return ctx.measureText(text).width / PR;
      });
    },
  };
}

export type Brush = ReturnType<typeof getBrush>;
