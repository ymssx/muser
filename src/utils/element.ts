import Element from '../element';
import CanvasProxy from '../canvasExtends';
import { Data } from 'src/const/common';

export const bindElements = (father: Element, children: Element) => {
  children.$.father = father;
  // if father dont have a root element, father is the root
  children.$.root = father.$.root || father;
};

export const bindElementsLayer = (elementMap: { [key: string]: Element }, element: Element) => {
  for (const name in elementMap) {
    const element = elementMap[name];
    element.$.root = element;
    if (element.$.childMap) {
      bindElementsLayer(element.$.childMap, element);
    }
  }
};

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

export const bindTree = (elementMap: { [name: string]: Element }, father: Element) => {
  for (const name in elementMap) {
    const element = elementMap[name];
    bindElements(father, element);
  }
};

export const updateProps = (element: Element, props: Data) => {
  element.$.props = {
    ...element.$.props,
    ...props,
  };
};
