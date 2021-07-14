import { CanvasElement, Data } from '../const/common';
import { ElementConfigExtend } from '../const/element';
import Element from '../element';
import Updater from '../update/update';
import CanvasProxy from '../canvasExtends';

export interface ElementPrivateProps {
  canvas: CanvasElement | null;
  father: Element | null;
  root: Element | null;
  updater: Updater;
  props: Data;
  elPainterMap: { [name: string]: Function };
  isCollectingChilds: boolean;
  tempChildStack: Element[];
  childList: Element[];
  childMap: { [name: string]: Element };
  childs: { [name: string]: (props: Data, config: ElementConfigExtend) => CanvasProxy };
  stale: boolean; // if component need update
  hasInit: boolean; // if the component rendered for the first time
  dependence: Data;
  isAnsysingDependence: boolean;
}

export const initElementPrivateProps = (element: Element) => {
  return {
    canvas: null,
    father: null,
    root: null,
    updater: new Updater(element),
    props: {},
    elPainterMap: {},
    isCollectingChilds: false,
    tempChildStack: [],
    childList: [],
    childMap: {},
    childs: {},
    stale: false,
    hasInit: false,
    isAnsysingDependence: false,
    dependence: {},
  };
};
