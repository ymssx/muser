import Element from '../element';
import CanvasProxy from '../canvasExtends';
import { bindTree } from './element';
import { CanvasElement } from 'src/const/common';

/**
 * a proxy of origin component
 */
export const getChildProxy = (elementMap: { [name: string]: Element }, father: Element) => {
  return new Proxy(
    {},
    {
      get(_, name: string) {
        const element = elementMap[name];

        if (!father.$.elPainterMap[name]) {
          const ext = new CanvasProxy(element);
          father.$.elPainterMap[name] = ext.updateProps.bind(ext);
        }

        if (father.$.isCollectingChilds) {
          father.$.tempChildStack.push(element);
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

        if (element.$.isAnsysingDependence) {
          element.$.dependence[key] = res;
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
  const stateProxy = new Proxy(
    {},
    {
      get(originState, key: string) {
        let res;

        if (element.$.state.hasOwnProperty(key)) {
          res = element.$.state[key];
        }

        if (element.$.isAnsysingDependence) {
          element.$.dependence[key] = res;
        }

        return res;
      },
      set(originState, key: string, value) {
        if (element.$.state[key] !== value) {
          element.$.stale = true;
          element.$.updater.registUpdate();
        }
        element.$.state[key] = value;
        return true;
      },
    }
  );

  Object.defineProperty(element, 'state', {
    get() {
      return stateProxy;
    },
    set(value) {
      this.$.state = value;
      element.$.stale = true;
      element.$.updater.registUpdate();
    },
  });

  return stateProxy;
};

export const setChildProxy = (element: Element) => {
  Object.defineProperty(element, 'childMap', {
    set(elementMap: { [name: string]: Element }) {
      bindTree(elementMap, element);
      element.$.childMap = elementMap;
      element.$.childs = getChildProxy(elementMap, element);
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
};

export const setCanvasProxy = (element: Element) => {
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
};
