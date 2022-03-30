import Element from './element';

export enum LifeCycleHooks {
  CREATED = 'created',
  BEFORE_RENDER = 'before-render',
  AFTHER_RENDER = 'after-render',
  BEFORE_UPDATE = 'before-update',
  AFTER_UPDATE = 'after-update',
}

export default class LifeCycle {
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  hooks = {
    [LifeCycleHooks.CREATED]: new Set<Function>(),
    [LifeCycleHooks.BEFORE_RENDER]: new Set<Function>(),
    [LifeCycleHooks.AFTHER_RENDER]: new Set<Function>(),
    [LifeCycleHooks.BEFORE_UPDATE]: new Set<Function>(),
    [LifeCycleHooks.AFTER_UPDATE]: new Set<Function>(),
  };

  add(hook: LifeCycleHooks, action: Function) {
    this.hooks[hook]?.add(action);
  }

  useHooks(hook: LifeCycleHooks) {
    const set = this.hooks[hook];
    set?.forEach((action) => {
      const del = action();
      if (del) {
        set.delete(action);
      }
    });
  }

  start() {
    this.useHooks(LifeCycleHooks.CREATED);
    if (this.element.created instanceof Function) {
      this.element.created();
    }
  }

  beforeRender() {
    this.useHooks(LifeCycleHooks.BEFORE_RENDER);
    if (this.element.beforeRender instanceof Function) {
      this.element.beforeRender();
    }
  }

  afterUpdate() {
    this.useHooks(LifeCycleHooks.AFTER_UPDATE);
  }
}
