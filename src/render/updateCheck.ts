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
  if (!element.config.cache) return true;

  const oldProps = element.$.props;

  let flag = false;
  for (const key in props) {
    if (oldProps[key] !== props[key]) {
      flag = true;
      for (const [renderFunction, { propSet }] of element.$.dependence) {
        if (propSet?.has(key)) {
          element.$.updateRenderFunctions.add(renderFunction);
        }
      }
    }
  }
  return flag;
};

export const hasChangeState = (element: Element, state: Data) => {
  if (!element.$.hasInit) return true;

  const oldState = element.$.state;

  let flag = false;
  for (const key in state) {
    if (oldState[key] !== state[key]) {
      flag = true;
      for (const [renderFunction, { stateSet }] of element.$.dependence) {
        if (stateSet?.has(key)) {
          element.$.updateRenderFunctions.add(renderFunction);
        }
      }
    }
  }
  return flag;
};
