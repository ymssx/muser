import { objectDiff } from '../utils/common';
import { Data } from '../const/common';
import Element from '../element';

export const isChildsStale = (element: Element) => {
  for (const name in element.$.childList) {
    const el = element.$.childList[name];
    if (el.$.stale) {
      return true;
    }
  }
  return false;
};

export const hasChangeProps = (props: Data, element: Element) => {
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
  return element.$.stale || isChildsStale(element) || hasChangeProps(props, element);
};

export const setState = (newState: Data = {}, element: Element) => {
  element.state = {
    ...element.state,
    ...newState,
  };
};
