import { Data, CanvasElement, RenderFunction } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { Default } from './const/default';
import { renderSlot } from './render/render';
import { getPropsProxy, setChildProxy, setCanvasProxy, setState, reactiveState } from './utils/proxy';
import { ElementPrivateProps, initElementPrivateProps } from './utils/element-private-props';
import ChildProxy from './render/child';
import { addEventListener, EventCallBack } from './event/index';
import getBrush, { Brush } from './canvas-api/index';

export default abstract class Element<T extends Object> {
  /**
   * private status of component
   * do not use '$' to name your component methods
   */
  $: ElementPrivateProps<T> = initElementPrivateProps<T>(this);

  public props: T;
  public state: Data = {};
  public canvas: CanvasElement;
  public childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => ChildProxy<Object> } = {};
  public childMap: { [name: string]: Element<Object> } = {};
  public brush: Brush;
  public config: ElementConfig;

  // canvas render method
  abstract render(element: Element<T>): RenderFunction | RenderFunction[];
  public slot(name = 'default') {
    renderSlot(this, name);
  }

  // lifecycle methods
  created?(): void;
  beforeRender?(): void;
  rendered?(): void;
  updated?(): void;
  destroyed?(): void;

  public setState(newProps: Data) {
    return setState(newProps, this);
  }

  public addEventListener(eventName: string, callback: EventCallBack) {
    return addEventListener(this, eventName, callback);
  }

  public changeCursor(cursor: string) {
    if (this.$.root && this.$.root.canvas instanceof HTMLCanvasElement) {
      this.$.root.canvas.style.cursor = cursor;
    }
  }

  get context() {
    const { alpha } = this.config;
    return this.canvas.getContext('2d', { alpha }) as CanvasRenderingContext2D;
  }

  get PR() {
    return window.devicePixelRatio;
  }

  constructor(config: ElementConfigExtend) {
    Object.defineProperty(this, '$', { writable: false }); // lock private property '$'
    this.config = {
      ...Default.Element.config,
      ...config,
    };

    /**
     * setChildProxy:
     *   - bind a Proxy to visit component's childs
     * setCanvasProxy:
     *   - bind a Proxy to return whether itself Canvas or father's Canvas
     *   - which depends on the value of 'config.cache'
     */
    this.childs = setChildProxy(this);
    this.canvas = setCanvasProxy(this);
    this.brush = getBrush(this);

    // set a Proxy to record the reading action of 'Props'
    this.props = getPropsProxy(this) as T;
    reactiveState(this); // listen for state changes

    this.$.lifecycle.start();
  }
}
