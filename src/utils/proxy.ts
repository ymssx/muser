import Element from '../element';
import ChildProxy, { addChildList } from '../render/child';
import { bindTree, bindElements } from './element';
import { CanvasElement, Data } from '../const/common';
import { initCanvas } from '../utils/canvas';
import { hasChangeState } from '../render/updateCheck';
import { StaleStatus } from '../const/render';

/**
 * a proxy of origin component
 */
export const getChildProxy = (element: Element<Object>) => {
  return new Proxy(
    {},
    {
      get(_, name: string) {
        const { childMap, father } = element.$;

        let target: Element<Object>;
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
          const ext = new ChildProxy(target);
          return ext.updateProps.bind(ext);
        }

        if (!father.$.elPainterMap[name]) {
          const ext = new ChildProxy(target);
          father.$.elPainterMap[name] = ext.updateProps.bind(ext);
        }

        if (father.$.isCollectingChilds) {
          addChildList(father, target);
        }

        return father.$.elPainterMap[name];
      },
    }
  );
};

export const getPropsProxy = (element: Element<Object>) => {
  return new Proxy(
    {},
    {
      get(originProps, key: string) {
        let res;

        const $props = element.$.props as Data;
        if ($props.hasOwnProperty(key)) {
          res = $props[key];
        }

        if (element.$.isAnsysingDependence && element.$.currentRenderFunctionIndex !== -1) {
          const renderFunctionIndex = element.$.currentRenderFunctionIndex;
          if (!element.$.dependence.has(renderFunctionIndex)) {
            element.$.dependence.set(renderFunctionIndex, {
              stateSet: new Set(),
              propSet: new Set(),
            });
          }
          const dependenceSet = element.$.dependence.get(renderFunctionIndex);
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

export const getStateProxy = (element: Element<Object>) => {
  return new Proxy(
    {},
    {
      get(originState, key: string) {
        let res;

        if (element.$.state.hasOwnProperty(key)) {
          res = element.$.state[key];
        }

        if (element.$.isAnsysingDependence && element.$.currentRenderFunctionIndex !== -1) {
          const renderFunctionIndex = element.$.currentRenderFunctionIndex;
          if (!element.$.dependence.has(renderFunctionIndex)) {
            element.$.dependence.set(renderFunctionIndex, {
              stateSet: new Set(),
              propSet: new Set(),
            });
          }
          const dependenceSet = element.$.dependence.get(renderFunctionIndex);
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

export const reactiveState = (element: Element<Object>) => {
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

export const setState = (newState: Data = {}, element: Element<Object>) => {
  if (hasChangeState(element, newState)) {
    element.$.state = {
      ...element.$.state,
      ...newState,
    };

    element.$.stale = StaleStatus.Updater;
    element.$.updater.update();
  }
};

export const setChildProxy = (element: Element<Object>) => {
  element.$.childs = getChildProxy(element);
  Object.defineProperty(element, 'childMap', {
    set(elementMap: { [name: string]: Element<Object> }) {
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

export const setCanvasProxy = (element: Element<Object>): CanvasElement => {
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
