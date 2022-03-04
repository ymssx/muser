import Element from '../element';
import CanvasProxy from '../canvasExtends';
import { bindTree, bindElements } from './element';
import { CanvasElement, Data } from '../const/common';
import { initCanvas } from '../utils/canvas';
import { hasChangeState } from '../render/updateCheck';

/**
 * a proxy of origin component
 */
export const getChildProxy = (element: Element) => {
  return new Proxy(
    {},
    {
      get(_, name: string) {
        const { childMap, father } = element.$;

        let target: Element;
        if (childMap.hasOwnProperty(name)) {
          target = childMap[name];
        } else if (element.hasOwnProperty(name)) {
          target = (element as any)[name];
          childMap[name] = target;
          bindElements(element, target);
        } else {
          throw new Error(`No element named ${name}`);
        }

        if (!father) {
          const ext = new CanvasProxy(target);
          return ext.updateProps.bind(ext);
        }

        if (!father.$.elPainterMap[name]) {
          const ext = new CanvasProxy(target);
          father.$.elPainterMap[name] = ext.updateProps.bind(ext);
        }

        if (father.$.isCollectingChilds) {
          father.$.childList.unshift(target);
        }

        return father.$.elPainterMap[name];
      },
    }
  );
};

export const getPropsProxy = (element: Element) => {
  return new Proxy(
    {},
    {
      get(originProps, key: string) {
        let res;

        if (element.$.props.hasOwnProperty(key)) {
          res = element.$.props[key];
        }

        if (element.$.isAnsysingDependence && element.$.currentRenderFunction) {
          const renderFunction = element.$.currentRenderFunction;
          if (!element.$.dependence.has(renderFunction)) {
            element.$.dependence.set(renderFunction , {
              stateSet: new Set(),
              propSet: new Set(),
            });
          }
          const dependenceSet = element.$.dependence.get(renderFunction);
          if (dependenceSet) {
            dependenceSet.propSet.add(key);
          }
        }

        return res;
      },
      set() {
        // props is not allowed to modify
        return false;
      },
    }
  );
};

export const getStateProxy = (element: Element) => {
  return new Proxy(
    {},
    {
      get(originState, key: string) {
        let res;

        if (element.$.state.hasOwnProperty(key)) {
          res = element.$.state[key];
        }

        if (element.$.isAnsysingDependence && element.$.currentRenderFunction) {
          const renderFunction = element.$.currentRenderFunction;
          if (!element.$.dependence.has(renderFunction)) {
            element.$.dependence.set(renderFunction , {
              stateSet: new Set(),
              propSet: new Set(),
            });
          }
          const dependenceSet = element.$.dependence.get(renderFunction);
          if (dependenceSet) {
            dependenceSet.stateSet.add(key);
          }
        }

        return res;
      },
      set(originState, key: string, value) {
        element.$.state[key] = value;
        return true;
      },
    }
  );
};

export const reactiveState = (element: Element) => {
  const proxy = getStateProxy(element);
  Object.defineProperty(element, 'state', {
    get() {
      return proxy;
    },
    set(newState) {
      element.$.state = newState;
    },
  });
};

export const setState = (newState: Data = {}, element: Element) => {
  if (hasChangeState(element, newState)) {
    element.$.state = {
      ...element.$.state,
      ...newState,
    };

    element.$.stale = true;
    element.$.updater.registUpdate();
  };
};

export const setChildProxy = (element: Element) => {
  element.$.childs = getChildProxy(element);
  Object.defineProperty(element, 'childMap', {
    set(elementMap: { [name: string]: Element }) {
      bindTree(elementMap, element);
      element.$.childMap = elementMap;
    },
  });
  Object.defineProperty(element, 'childs', {
    get() {
      return element.$.childs;
    },
    set() {
      return false;
    },
  });
  return element.childs;
};

export const setCanvasProxy = (element: Element): CanvasElement => {
  element.$.canvas = initCanvas(element);

  Object.defineProperty(element, 'canvas', {
    // proxy of canvas, returns father's canvas if 'config.cache' is false
    set(canvas: CanvasElement) {
      element.$.canvas = canvas;
    },
    get(): CanvasElement {
      if (!element.config.cache) {
        if (element.$.father) {
          return element.$.father.canvas;
        } else {
          throw new Error('Root element must have a canvas instance');
        }
      }
      return element.$.canvas as CanvasElement;
    },
  });

  return element.canvas;
};
