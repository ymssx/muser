import { Element } from '../../src/index';
import Box from './box';

export default class Test extends Element {
  constructor() {
    super();
    this.childMap = {
      box1: new Box(),
      box2: new Box(),
    };
  }

  paint() {
    const ctx = this.context;
    const { box1, box2 } = this.childs;

    // ctx.moveTo(10, 10);

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