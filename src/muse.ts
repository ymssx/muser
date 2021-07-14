import { CanvasElement, Data } from './const/common';
import { ElementConfig } from './const/element';
import Element from './element';

export default class Muse {
  childs: Element[] = [];

  constructor(childs: Element[]) {
    this.childs = childs;
  }

  paint() {
    const paintList: Promise<void>[] = [];
    this.childs.forEach((element) => {
      paintList.push(element.$paint());
    });
    return Promise.all(paintList);
  }
}
