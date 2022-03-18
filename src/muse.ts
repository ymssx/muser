import Element from './element';
import { updateElementTree } from './render/render';
import env, { ENV } from './utils/env';
import { addEventListener } from './worker/message';
import { Data } from './const/common';
import { listenEvent } from './event/index';
import { updateProps } from './render/updateCheck';

if (env === ENV.worker) {
}

export default class Muse {
  childs: Element<Object>[] = [];

  constructor(childs: Element<Object>[]) {
    this.childs = childs;

    this.childs.forEach((element) => {
      // listen for dom events
      listenEvent(element);
    });

    if (env === ENV.worker) {
      addEventListener(this);
    }
  }

  render(props?: Data) {
    this.childs.forEach((element) => {
      updateProps(element, props || {});
      updateElementTree(element);
    });
  }
}
