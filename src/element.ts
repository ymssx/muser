import { Data, CanvasElement } from './const/common';
import { ElementConfig, ElementConfigExtend } from './const/element';
import { Default } from './const/default';
import { renderSlot } from './render/render';
import { initCanvas } from './utils/canvas';
import { getPropsProxy, getStateProxy, setChildProxy, setCanvasProxy, setState, reactiveState } from './utils/proxy';
import { ElementPrivateProps, initElementPrivateProps } from './utils/elementPrivateProps';
import CanvasProxy from './canvasExtends';

export default abstract class Element {
  /**
   * private status of component
   * do not use '$' to name your component methods
   */
  $: ElementPrivateProps = initElementPrivateProps(this);

  public props: Data;
  public state: Data = {};
  public config: ElementConfig = Default.Element.config;
  public canvas: CanvasElement;
  public childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => CanvasProxy } = {};
  public childMap: { [name: string]: Element } = {};

  // canvas piant method
  abstract render(element: Element): void;
  public slot(name = 'default') {
    renderSlot(this, name);
  }

  // lifecycle methods
  created?(): void;
  painted?(): void;
  updated?(): void;
  destroyed?(): void;

  public setState(newProps: Data) {
    return setState(newProps, this);
  }

  get context() {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(config: ElementConfigExtend) {
    Object.defineProperty(this, '$', { writable: false }); // lock private property '$'

    this.config = {
      ...Default.Element.config,
      ...config,
    };

    setChildProxy(this);
    setCanvasProxy(this);

    this.props = getPropsProxy(this);
    this.canvas = initCanvas(this);

    reactiveState(this); // listen for state changes

    this.$.lifecycle.start();
  }
}
