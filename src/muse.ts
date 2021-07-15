import Element from './element';
import { updateElementTree } from './render/render';

export default class Muse {
  childs: Element[] = [];

  constructor(childs: Element[]) {
    this.childs = childs;
  }

  paint() {
    this.childs.forEach((element) => {
      updateElementTree(element);
    });
  }
}
