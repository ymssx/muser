import Element from '../element';

export const bindElements = (father: Element<Object>, children: Element<Object>) => {
  children.$.father = father;
  // if father dont have a root element, father is the root
  children.$.root = father.$.root || father;
  children.$.floor = father.$.floor + 1;
};

export const bindElementsLayer = (elementMap: { [key: string]: Element<Object> }, element: Element<Object>) => {
  for (const name in elementMap) {
    const element = elementMap[name];
    element.$.root = element;
    if (element.$.childMap) {
      bindElementsLayer(element.$.childMap, element);
    }
  }
};

export const bindTree = (elementMap: { [name: string]: Element<Object> }, father: Element<Object>) => {
  for (const name in elementMap) {
    const element = elementMap[name];
    bindElements(father, element);
  }
};
