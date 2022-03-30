import Element from '../element';
import { Data } from '../const/common';
import { hasChangeState } from '../render/updateCheck';
import { StaleStatus } from '../const/render';
import { getStateProxy } from '../utils/proxy';

export const reactiveState = function(element: Element) {
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

export const setState = function(newState: Data = {}, element: Element) {
  if (hasChangeState(element, newState)) {
    element.$.state = {
      ...element.$.state,
      ...newState,
    };

    element.$.stale = StaleStatus.Updater;
    element.$.updater.update();
  }
};

export const smoothState = function(newState: Data = {}, during: number, element: Element) {

};

export const infiniteState = function(newState: Data = {}, element: Element) {

};