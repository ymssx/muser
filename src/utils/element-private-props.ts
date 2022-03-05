import { CanvasElement, Data, RenderFunction } from '../const/common';
import { ElementConfigExtend } from '../const/element';
import { PaintConfig } from '../const/render';
import Element from '../element';
import Updater from '../render/updater';
import ChildProxy from '../render/child';
import LifeCycle from '../lifecycle';

export interface ElementPrivateProps {
  canvas: CanvasElement | null;
  father: Element | null;
  root: Element | null;
  updater: Updater;
  props: Data;
  state: Data;
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  childList: Element[];
  childMap: { [name: string]: Element };
  childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => ChildProxy };
  stale: boolean; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: Map<number, { stateSet: Set<string>; propSet: Set<string> }>;
  renderFunctions: RenderFunction[];
  updateRenderFunctions: Set<number>;
  currentRenderFunctionIndex: number;
  isAnsysingDependence: boolean;
  lifecycle: LifeCycle;
  stateReactive: boolean;
  positionSnapshots: [[number[], number[]], PaintConfig][];
  propsSnapshots: Data[];
  snapFlag: boolean;
  currentPosition: [number[], number[]];
  floor: number;
  canvasName: string | null;
  processSet: Set<(element: Element) => void>;
  slotsMap: Map<string, (element: Element) => void>;
  eventMap: Map<string, Set<Function>>;
  useElementIndex: number;
}

export const initElementPrivateProps = (element: Element) => ({
  canvas: null,
  father: null,
  root: null,
  updater: new Updater(element),
  props: {},
  state: {},
  elPainterMap: {},
  isCollectingChilds: false,
  childList: [],
  childMap: {},
  childs: {},
  stale: true,
  hasInit: false,
  isAnsysingDependence: false,
  dependence: new Map(),
  renderFunctions: [],
  updateRenderFunctions: new Set<number>(),
  currentRenderFunctionIndex: -1,
  lifecycle: new LifeCycle(element),
  stateReactive: false,
  positionSnapshots: [],
  propsSnapshots: [],
  snapFlag: false,
  currentPosition: [[], []] as [number[], number[]],
  floor: 0,
  canvasName: null,
  processSet: new Set<(element: Element) => void>(),
  slotsMap: new Map<string, (element: Element) => void>(),
  eventMap: new Map(),
  useElementIndex: 0,
});
