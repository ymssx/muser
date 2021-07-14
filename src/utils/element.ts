import Element from '../element';
import CanvasProxy from '../canvasExtends';
import { Data } from '../const/common';

export const bindElements = (father: Element, children: Element) => {
  children.$.father = father;
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
          // bindElements(father, element);
          const ext = new CanvasProxy(element);
          // TODO
          father.$.elPainterMap[name] = ext.paint.bind(ext);
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
      get(props, key: string) {
        let res;

        if (props.hasOwnProperty(key)) {
          res = element.$.props[key];
        }

        if (element.$.isAnsysingDependence) {
          element.$.dependence[key] = res;
        }

        return res;
      },
      set(props, key: string, value) {
        element.$.props[key] = value;
        return true;
      },
    }
  );
};

export const bindTree = (elementMap: { [name: string]: Element }, father: Element) => {
  for (const name in elementMap) {
    const element = elementMap[name];
    bindElements(father, element);
  }
};
