import Element from '../element';
import { Data } from '../const/common';
import { hasChangeState } from '../render/updateCheck';
import { StaleStatus } from '../const/render';
import { getStateProxy } from '../utils/proxy';
import { LifeCycleHooks } from '../lifecycle';

export const reactiveState = function (element: Element) {
  const proxy = getStateProxy(element);
  Object.defineProperty(element, 'state', {
    get() {
      return proxy;
    },
    set(newState) {
      element.$.state = newState;
    },
  });
};

export const setState = function (newState: Data = {}, element: Element) {
  return new Promise<void>((resolve) => {
    if (hasChangeState(element, newState)) {
      element.$.state = {
        ...element.$.state,
        ...newState,
      };

      element.$.stale = StaleStatus.Updater;
      element.$.updater.update();
      element.$.lifecycle.add(LifeCycleHooks.AFTER_UPDATE, () => {
        resolve();
        return true;
      });
    } else {
      resolve();
    }
  });
};

export const smoothState = function (newState: Data = {}, during: number, element: Element) {
  const start = new Date().getTime();
  const getPercent = () => {
    const now = new Date().getTime();
    return Math.min(1, (now - start) / during);
  };

  const oldState = element.$.state;
  const requestSetState = () => {
    const percent = getPercent();
    const currentState: Data = {};
    for (const key in newState) {
      const target = newState[key];
      if (typeof target === 'number') {
        const old = Number(oldState[key]) || 0;
        currentState[key] = (target - old) * percent + old;
      }
    }
    setState(currentState, element).then(() => {
      if (percent < 1) {
        requestSetState();
      }
    });
  };
  requestSetState();
};

export const infiniteState = function (newState: Data = {}, element: Element) {};
