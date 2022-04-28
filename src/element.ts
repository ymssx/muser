import { Data, CanvasElement, RenderFunction } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { Default } from './const/default';
import { renderSlot, updateElementTree } from './render/render';
import { getPropsProxy, setChildProxy, setCanvasProxy } from './utils/proxy';
import { setState, smoothState, infiniteState, reactiveState } from './render/state';
import { ElementPrivateProps, initElementPrivateProps } from './utils/element-private-props';
import ChildProxy from './render/child';
import { addEventListener, EventCallBack } from './event/index';
import getBrush, { Brush } from './canvas-api/index';
import { updateProps } from './render/updateCheck';

export default abstract class Element<T extends Object = Object> {
  /**
   * private status of component
   * do not use '$' to name your component methods
   */
  $: ElementPrivateProps<T> = initElementPrivateProps<T>(this);

  public props: T;
  public state: Data = {};
  public canvas: CanvasElement;
  public childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => ChildProxy<Object> } = {};
  public childMap: { [name: string]: Element } = {};
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

  public setState(newState: Data) {
    return setState(newState, this);
  }

  /**
   * smoothly change the state in during time
   */
  public smoothState(newState: Data, during: number) {
    return smoothState(newState, during, this);
  }

  /**
   * infinitly increase the state with steps
   */
  public infiniteState(newState: Data) {
    return infiniteState(newState, this);
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

  init(props: T) {
    updateProps(this, props || {});
    updateElementTree(this);
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
