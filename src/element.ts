import { Data, CanvasElement } from 'src/const/common';
import { ElementConfig } from 'src/const/element';
import { LifeCycle } from 'src/lifecycle';
import { Default } from 'src/const/default';
import { createCanvas } from 'src/utils/canvas';
import { getChildProxy } from 'src/utils/element';

export const PROP = '__PRIVATE_PROP__';
interface ElementPrivateProps {
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  tempChildStack: Element[];
  childs: Element[];
  stale: boolean; // if component need update
}

export default abstract class Element {
  public props: Data = {};
  public data: Data = {};
  public config: ElementConfig = Default.Element.config;
  public canvas: CanvasElement = createCanvas(this.config.width, this.config.height);
  public father: Element | null = null;

  private [PROP]: ElementPrivateProps = {
    elPainterMap: {},
    isCollectingChilds: false,
    tempChildStack: [],
    childs: [],
    stale: false,
  };

  get context() {
    return this.canvas.getContext('2d');
  }

  set childs(elementMap: { [name: string]: Element }) {
    this.childs = getChildProxy(elementMap, this);
  }

  constructor(props: Data = {}, config: ElementConfig = Default.Element.config) {
    this.props = props;
    this.config = config;
  };

  abstract paint(): void;
}