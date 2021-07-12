import type Element from "src/element"

export const bindElements = (father: Element, children: Element) => {
  children.father = father;
};