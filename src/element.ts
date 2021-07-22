import { Data, CanvasElement } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { Default } from './const/default';
import { createCanvas } from './utils/canvas';
import { getChildProxy, getPropsProxy, bindTree } from './utils/element';
import { isWorthToUpdate } from './render/index';
import { ElementPrivateProps, initElementPrivateProps } from './utils/elementPrivateProps';
import { setData } from './render/updateCheck';

export default abstract class Element {
  $: ElementPrivateProps;
  public props: Data;
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;

  abstract paint(): void;

  $paintWithProps(props: Data) {
    Object.assign(this.props, props);

    if (isWorthToUpdate(props, this)) {
      return this.paint();
    }
  }

  $directPaint(element: Element, config?: ElementConfig) {}

  public setData(newProps: Data) {
    return setData(newProps, this);
  }

  get context() {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  // proxy of childs conponents, which returns a paint function
  set childMap(elementMap: { [name: string]: Element }) {
    bindTree(elementMap, this);
    this.$.childMap = elementMap;
    this.$.childs = getChildProxy(elementMap, this);
  }

  get childs() {
    return this.$.childs;
  }

  // proxy of canvas, returns father's canvas if 'config.cache' is false
  set canvas(canvas: CanvasElement) {
    this.$.canvas = canvas;
  }

  get canvas(): CanvasElement {
    if (!this.config.cache) {
      if (this.$.father) {
        return this.$.father.canvas;
      } else {
        throw new Error('Root element must have a canvas instance');
      }
    }
    return this.$.canvas as CanvasElement;
  }

  constructor(config: ElementConfigExtend, canvas?: CanvasElement) {
    this.config = {
      ...Default.Element.config,
      ...config,
    };
    /**
     * private status of component
     * do not use '$' to name your component methods
     */
    this.$ = initElementPrivateProps(this);

    this.props = getPropsProxy(this);

    if (this.config.cache) {
      this.canvas = canvas ?? createCanvas(this.config.width, this.config.height);
    }
  }
}
