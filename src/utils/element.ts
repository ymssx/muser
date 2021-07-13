import Element from '../element';
import CanvasProxy from '../canvasExtends';
import { Data } from '../const/common';

export const bindElements = (father: Element, children: Element) => {
  children.father = father;
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
          bindElements(father, element);
          const ext = new CanvasProxy(element);
          // TODO
          father.$.elPainterMap[name] = ext.paint.bind(ext);
        }

        if (father.$.isCollectingChilds) {
          father.$.tempChildStack.push(element);
        }

        return elementMap[name];
      },
    }
  );
};

export const getPropsProxy = (props: Data, element: Element) => {
  return new Proxy(props, {
    get(props, key: string) {
      let res;

      if (props.hasOwnProperty(key)) {
        res = props[key];
      }

      if (element.$.isAnsysingDependence) {
        element.$.dependence[key] = res;
      }

      return res;
    },
    set(props, key: string, value) {
      props[key] = value;
      return true;
    },
  });
};
