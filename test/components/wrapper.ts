import { Element } from '../../src/index';
import Box from './box';

export default class Test extends Element {
  constructor(config: any) {
    super(config);
    this.childMap = {
      box1: new Box({ width: 100, height: 100 }),
      box2: new Box({ width: 100, height: 100 }),
    };
  }

  paint() {
    console.log('wrapper', this.props);
    const ctx = this.context;
    const { box1, box2 } = this.childs;

    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 300, 300);

    // ctx.moveTo(10, 10);

    box1({
      a: 1,
      b: 2,
      color: 'blue',
    },
    {
      width: 100,
      height: 200,
      cache: true,
    })
      .rotate({ angle: 30 })
      .paste({
        x: 10,
        y: 10,
      });
  }
}