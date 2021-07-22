import { Element } from '../../src/index';

export default class Box extends Element {
  paint() {
    const ctx = this.context;
    console.log(ctx);

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, 100, 30);
    // ctx?.moveTo(10, 10);
  }
}
