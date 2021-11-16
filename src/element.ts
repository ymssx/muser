import { Data, CanvasElement } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { Default } from './const/default';
import { bindCanvas, createCanvas } from './utils/canvas';
import { getPropsProxy, getStateProxy, setChildProxy, setCanvasProxy } from './utils/proxy';
import { ElementPrivateProps, initElementPrivateProps } from './utils/elementPrivateProps';
import { setState } from './render/updateCheck';

export default abstract class Element {
  $: ElementPrivateProps;
  public props: Data;
  public state: Data;
  public config: ElementConfig = Default.Element.config;
  public canvas: CanvasElement;
  public childs: { [name: string]: Function } = {};
  public childMap: { [name: string]: Element } = {};
  abstract paint(element: Element): void;

  public setState(newProps: Data) {
    return setState(newProps, this);
  }

  get context() {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(config: ElementConfigExtend) {
    this.config = {
      ...Default.Element.config,
      ...config,
    };
    /**
     * private status of component
     * do not use '$' to name your component methods
     */
    this.$ = initElementPrivateProps(this);

    setChildProxy(this);
    setCanvasProxy(this);

    this.props = getPropsProxy(this);
    this.state = getStateProxy(this);
    this.canvas = this.config.canvas
      ? bindCanvas(this.config.canvas, this.config.width, this.config.height)
      : createCanvas(this.config.width, this.config.height);
  }
}
