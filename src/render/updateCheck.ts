import { objectDiff } from '../utils/common';
import { Data } from '../const/common';
import Element from '../element';

export const updateProps = (element: Element, props: Data) => {
  if (hasChangeProps(element, props)) {
    element.$.stale = true;
    element.$.props = {
      ...element.$.props,
      ...props,
    };
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

  let flag = false;
  for (const key in props) {
    if (element.$.propsDependence.has(key)) {
      if (props[key] !== element.$.propsDependence.get(key)?.value) {
        flag = true;
        element.$.propsDependence.get(key)?.render?.forEach(renderFunction => {
          element.$.updateRenderFunctions.add(renderFunction);
        });
      }
    }
  }
  return flag;
};

export const hasChangeState = (element: Element, state: Data) => {
  if (!element.$.hasInit) return true;

  let flag = false;
  for (const key in state) {
    if (element.$.stateDependence.has(key)) {
      if (state[key] !== element.$.stateDependence.get(key)?.value) {
        flag = true;
        element.$.stateDependence.get(key)?.render?.forEach(renderFunction => {
          element.$.updateRenderFunctions.add(renderFunction);
        });
      }
    }
  }
  return flag;
};

export const isWorthToUpdate = (props: Data, element: Element) => {
  return element.$.stale || isChildsStale(element) || hasChangeProps(element, props);
};
