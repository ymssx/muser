import Element from './element';
import { updateElementTree } from './render/render';
import env, { ENV } from './utils/env';
import { addEventListener } from './worker/message';

if (env === ENV.worker) {
}

export default class Muse {
  childs: Element[] = [];

  constructor(childs: Element[]) {
    this.childs = childs;

    if (env === ENV.worker) {
      addEventListener(this);
    }
  }

  paint() {
    this.childs.forEach((element) => {
      updateElementTree(element);
    });
  }
}
