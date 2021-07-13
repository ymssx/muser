import { Data, CanvasElement } from "src/const/common";
import { ElementConfig, ElementConfigExtend } from "src/const/element";
import { LifeCycle } from "src/lifecycle";
import { Default } from "src/const/default";
import { createCanvas } from "src/utils/canvas";
import { getChildProxy, getPropsProxy } from "src/utils/element";
import { hasChangeProps } from "src/utils/common";

interface ElementPrivateProps {
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  tempChildStack: Element[];
  childs: Element[];
  stale: boolean; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: Data;
  isAnsysingDependence: boolean;
}

export default abstract class Element {
  public props: Data = {};
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;
  public canvas: CanvasElement = createCanvas(
    this.config.width,
    this.config.height
  );
  public father: Element | null = null;

  /**
   * private status of component
   * do not use '$' to name your component methods
   */
  $: ElementPrivateProps = {
    elPainterMap: {},
    isCollectingChilds: false,
    tempChildStack: [],
    childs: [],
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
    for (const name in this.$.childs) {
      let el = this.$.childs[name];
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
    return this.canvas.getContext("2d");
  }

  set childs(elementMap: { [name: string]: Element }) {
    this.childs = getChildProxy(elementMap, this);
  }

  constructor(
    props: Data = {},
    config: ElementConfig = Default.Element.config
  ) {
    this.props = getPropsProxy(props, this);
    this.config = config;
  }

  abstract paint(): void;
}
