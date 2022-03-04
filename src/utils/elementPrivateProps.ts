import { CanvasElement, Data, RenderFunction } from '../const/common';
import { ElementConfigExtend } from '../const/element';
import { PaintConfig } from '../const/render';
import Element from '../element';
import Updater from '../render/updater';
import CanvasProxy from '../canvasExtends';
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
  childs: { [name: string]: (props: Data, config?: ElementConfigExtend) => CanvasProxy };
  stale: boolean; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: {
    [key: string]: {
      value: unknown,
      render: RenderFunction | null,
    };
  };
  isAnsysingDependence: boolean;
  currentRenderFunction: RenderFunction | null;
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
  dependence: {},
  currentRenderFunction: null,
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
});
