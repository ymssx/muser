import { Data, CanvasElement } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { LifeCycle } from './lifecycle';
import { Default } from './const/default';
import { createCanvas } from './utils/canvas';
import { getChildProxy, getPropsProxy, bindTree } from './utils/element';
import { hasChangeProps } from './utils/common';
import CanvasProxy from './canvasExtends';

interface ElementPrivateProps {
  canvas: CanvasElement | null;
  father: Element | null;
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  tempChildStack: Element[];
  childList: Element[];
  childs: { [name: string]: (props: Data, config: ElementConfigExtend) => CanvasProxy };
  stale: boolean; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: Data;
  isAnsysingDependence: boolean;
}

export default class Element {
  public props: Data = {};
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;

  /**
   * private status of component
   * do not use '$' to name your component methods
   */
  $: ElementPrivateProps = {
    canvas: null,
    father: null,
    elPainterMap: {},
    isCollectingChilds: false,
    tempChildStack: [],
    childList: [],
    childs: {},
    stale: false,
    hasInit: false,
    isAnsysingDependence: false,
    dependence: {},
  };

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

  $paintWithProps(props: Data, config: ElementConfigExtend) {
    Object.assign(this.props, props);

    if (this.$.stale || this.$isChildsStale || this.$isWorthToUpdate(props)) {
      return this.$paint();
    }
  }

  $paint() {}

  get context() {
    return this.canvas.getContext('2d');
  }

  // proxy of childs conponents, which returns a paint function
  set childMap(elementMap: { [name: string]: Element }) {
    bindTree(elementMap, this);
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

  constructor(props: Data = {}, config: ElementConfig = Default.Element.config) {
    this.props = getPropsProxy(props, this);
    this.config = config;

    if (config.cache) {
      this.canvas = createCanvas(this.config.width, this.config.height);
    }
  }
}
