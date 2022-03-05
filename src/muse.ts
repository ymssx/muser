import Element from './element';
import { updateElementTree } from './render/render';
import env, { ENV } from './utils/env';
import { addEventListener } from './worker/message';
import { Data } from './const/common';
import { listenEvent } from './event/index';

if (env === ENV.worker) {
}

export default class Muse {
  childs: Element[] = [];

  constructor(childs: Element[]) {
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
      updateElementTree(element, props);
    });
  }
}
