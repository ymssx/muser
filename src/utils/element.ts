import Element, { PROP } from "src/element"
import CanvasProxy from 'src/canvasExtends';

export const bindElements = (father: Element, children: Element) => {
  children.father = father;
};

export const getChildProxy = (elementMap: { [name: string]: Element }, father: Element) => {
  return new Proxy({}, {
    get(_, name: string) {
      const element = elementMap[name];

      if (!father[PROP].elPainterMap[name]) {
        bindElements(father, element);
        const ext = new CanvasProxy(element);
        // TODO
        father[PROP].elPainterMap[name] = ext.paint.bind(ext);
      }

      if (father[PROP].isCollectingChilds) {
        father[PROP].tempChildStack.push(element);
      }

      return elementMap[name];
    }
  });
};
