import { Muse, Element } from '../src/index';

class Box extends Element {
  constructor() {
    super();
  }

  paint() {
    const ctx = this.context;

    ctx?.moveTo(10, 10);
  }
}

class Test extends Element {
  constructor() {
    super();
  }

  childs = {
    box1: new Box(),
    box2: new Box(),
  };

  paint() {
    const ctx = this.context;
    const { box1, box2 } = this.childs;

    ctx?.moveTo(10, 10);

    box1({
      a: 1,
      b: 2,
    },
    {
      width: 100,
      height: 200,
      cache: true,
    })
      .rotate({ angle: 30 })
      .paint({ x: 10, y: 20 });
  }
}

const canvas = document.querySelector('#canvas');
const layer = new Muse();
