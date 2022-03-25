import { CanvasElement, Data, RenderFunction } from '../const/common';
import { ElementConfigExtend } from '../const/element';
import { PaintConfig, StaleStatus } from '../const/render';
import Element from '../element';
import Updater from '../render/updater';
import ChildProxy from '../render/child';
import LifeCycle from '../lifecycle';

export interface ElementPrivateProps<T> {
  canvas: CanvasElement | null;
  father: Element<Object> | null;
  root: Element<Object> | null;
  updater: Updater;
  props: T;
  state: Data;
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  childList: Element<Object>[];
  childMap: { [name: string]: Element<Object> };
  childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => ChildProxy<Object> };
  stale: StaleStatus; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: Map<number, { stateSet: Set<string>; propSet: Set<string> }>;
  renderFunctions: RenderFunction[];
  updateRenderFunctions: Set<number>;
  currentRenderFunctionIndex: number;
  fatherRenderFunctionIndex: number;
  isAnsysingDependence: boolean;
  lifecycle: LifeCycle;
  stateReactive: boolean;
  positionSnapshots: PaintConfig[];
  propsSnapshots: Object[];
  currentPosition: [number[], number[]];
  floor: number;
  canvasName: string | null;
  processSet: Set<(element: Element<Object>) => void>;
  slotsMap: Map<string, (element: Element<Object>) => void>;
  eventMap: Map<string, Set<Function>>;
  useElementIndex: number;
  mouseIn: boolean;
}

export const initElementPrivateProps = function <T extends Object>(element: Element<T>) {
  return {
    canvas: null,
    father: null,
    root: null,
    updater: new Updater(element),
    props: {} as T,
    state: {},
    elPainterMap: {},
    isCollectingChilds: false,
    childList: [],
    childMap: {},
    childs: {},
    stale: StaleStatus.Stale,
    hasInit: false,
    isAnsysingDependence: false,
    dependence: new Map(),
    renderFunctions: [],
    updateRenderFunctions: new Set<number>(),
    currentRenderFunctionIndex: -1,
    fatherRenderFunctionIndex: 0,
    lifecycle: new LifeCycle(element),
    stateReactive: false,
    positionSnapshots: [],
    propsSnapshots: [],
    currentPosition: [[], []] as [number[], number[]],
    floor: 0,
    canvasName: null,
    processSet: new Set<(element: Element<Object>) => void>(),
    slotsMap: new Map<string, (element: Element<Object>) => void>(),
    eventMap: new Map(),
    useElementIndex: 0,
    mouseIn: false,
  };
};
