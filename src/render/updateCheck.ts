import { StaleStatus } from '../const/render';
import { Data } from '../const/common';
import Element from '../element';

export const updateProps = (element: Element<Object>, props: Object) => {
  if (hasChangeProps(element, props)) {
    element.$.stale = StaleStatus.Updater;
    element.$.props = {
      ...element.$.props,
      ...props,
    };
  }
};

export const isChildsStale = (element: Element<Object>) => {
  for (const name in element.$.childList) {
    const el = element.$.childList[name];
    if (el.$.stale) {
      return true;
    }
  }
  return false;
};

export const hasChangeProps = function (element: Element<Object>, props: Object) {
  if (!element.$.hasInit) return true;
  if (!element.config.cache) return true;

  const oldProps = element.$.props as Data;

  let flag = false;
  for (const key in props) {
    if (oldProps[key] !== (props as Data)[key]) {
      for (const [renderFunctionIndex, { propSet }] of element.$.dependence) {
        if (propSet?.has(key)) {
          flag = true;
          element.$.updateRenderFunctions.add(renderFunctionIndex);
        }
      }
    }
  }
  return flag;
};

export const hasChangeState = (element: Element<Object>, state: Data) => {
  if (!element.$.hasInit) return true;

  const oldState = element.$.state as Data;

  let flag = false;
  for (const key in state) {
    if (oldState[key] !== state[key]) {
      for (const [renderFunctionIndex, { stateSet }] of element.$.dependence) {
        if (stateSet?.has(key)) {
          flag = true;
          element.$.updateRenderFunctions.add(renderFunctionIndex);
        }
      }
    }
  }
  return flag;
};
