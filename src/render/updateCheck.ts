import { objectDiff } from '../utils/common';
import { Data } from '../const/common';
import Element from '../element';

export const updateProps = (element: Element, props: Data) => {
  element.$.props = {
    ...element.$.props,
    ...props,
  };
  if (hasChangeProps(element, props)) {
    element.$.stale = true;
  }
};

export const isChildsStale = (element: Element) => {
  for (const name in element.$.childList) {
    const el = element.$.childList[name];
    if (el.$.stale) {
      return true;
    }
  }
  return false;
};

export const hasChangeProps = (element: Element, props: Data) => {
  if (!element.$.hasInit) return true;

  for (const key in props) {
    if (element.$.dependence.hasOwnProperty(key)) {
      const res = objectDiff(props[key], element.$.dependence[key]);
      if (res) {
        return true;
      }
    }
  }
  return false;
};

export const isWorthToUpdate = (props: Data, element: Element) => {
  return element.$.stale || isChildsStale(element) || hasChangeProps(element, props);
};
