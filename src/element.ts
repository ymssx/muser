import { Data, CanvasElement } from 'src/const/common';
import { ElementConfig } from 'src/const/element';
import { LifeCycle } from 'src/lifecycle';
import { Default } from 'src/const/default';
import { createCanvas } from 'src/utils/canvas';
import { bindElements } from 'src/utils/element';
import CanvasProxy from 'src/canvasExtends';

const API = '__PRIVATE_API__';
interface ElementPrivateProps {
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  tempChildStack: Element[];
}

export default abstract class Element {
  public props: Data = {};
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;
  public canvas: CanvasElement = createCanvas(this.config.width, this.config.height);
  public father: Element | null = null;

  private [API]: ElementPrivateProps = {
    elPainterMap: {},
    isCollectingChilds: false,
    tempChildStack: [],
  };

  get context() {
    return this.canvas.getContext('2d');
  }

  set childs(elementMap: { [name: string]: Element }) {
    const thisElement = this;
    this.childs = new Proxy({}, {
      get(_, name: string) {
        const element = elementMap[name];

        if (!thisElement[API].elPainterMap[name]) {
          bindElements(thisElement, element);
          const ext = new CanvasProxy(element);
          // TODO
          thisElement[API].elPainterMap[name] = ext.paint.bind(ext);
        }

        if (thisElement[API].isCollectingChilds) {
          thisElement[API].tempChildStack.push(element);
        }

        return elementMap[name];
      }
    });
  }

  constructor(props: Data = {}, config: ElementConfig = Default.Element.config) {
    this.props = props;
    this.config = config;
  };

  abstract paint(): void;
}