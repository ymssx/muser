import { Data, CanvasElement } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { LifeCycle } from './lifecycle';
import { Default } from './const/default';
import { createCanvas } from './utils/canvas';
import { getChildProxy, getPropsProxy, bindTree } from './utils/element';
import { hasChangeProps } from './utils/common';
import Updater from './utils/update';
import { ElementPrivateProps, initElementPrivateProps } from './utils/elementPrivateProps';

export default class Element {
  $: ElementPrivateProps;
  public props: Data = {};
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;

  $isWorthToUpdate(props: Data) {
    if (!this.$.hasInit) return true;

    for (const key in props) {
      if (this.$.dependence.hasOwnProperty(key)) {
        const res = hasChangeProps(props[key], this.$.dependence[key]);
        if (res) {
          return true;
        }
      }
    }
    return false;
  }

  get $isChildsStale() {
    for (const name in this.$.childList) {
      const el = this.$.childList[name];
      if (el.$.stale) {
        return true;
      }
    }
    return false;
  }

  $paintWithProps(props: Data) {
    Object.assign(this.props, props);

    if (this.$.stale || this.$isChildsStale || this.$isWorthToUpdate(props)) {
      return this.$paint();
    }
  }

  $paint(): Promise<void> {
    return new Promise(() => {});
  }

  $directPaint(element: Element, config?: ElementConfig) {}

  get context() {
    return this.canvas.getContext('2d');
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
      return (this.$.father as Element).canvas;
    }
    return this.$.canvas as CanvasElement;
  }

  setData() {}

  constructor(config: ElementConfig = Default.Element.config, canvas?: CanvasElement) {
    /**
     * private status of component
     * do not use '$' to name your component methods
     */
    this.$ = initElementPrivateProps(this);

    this.props = getPropsProxy(this);
    this.config = config;

    if (config.cache) {
      this.canvas = canvas ?? createCanvas(this.config.width, this.config.height);
    }
  }
}
