import { Element } from '../../src/index';

class Dot extends Element {
  paint({ context: ctx, props }: Element) {
    console.log('dot', this.props, this.$.props);
    const { color } = props;

    ctx.fillStyle = color as string || 'white';
    ctx.fillRect(0, 0, 10, 10);
  }
}

export default class Box extends Element {
  // childMap = {
  //   dot: new Dot({ width: 10, height: 10 }),
  // };

  test = new Dot({ width: 10, height: 10 });

  paint({ context: ctx, props, childs }: Element) {
    console.log('box', this.props, this.$.props);
    const { color } = props;
    const { test } = childs;

    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 100, 30);

    // dot({ color: '#fff' })
    //   .paste({ x: 10, y: 10 })
    //   .paste({ x: 30, y: 10 })
    //   .paste({ x: 50, y: 10 });

    // dot({ color: 'pink' })
    //   .paste({ x: 70, y: 10 })
    //   .paste({ x: 90, y: 10 });

    test({ color: 'pink' })
      .paste({ x: 10, y: 10 });
  }
}
