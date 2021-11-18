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
  dot = new Dot({ width: 10, height: 10 });

  state = {
    boxColor: 'red',
  };

  created() {
    setTimeout(() => {
      console.log('update');
      this.setState({
        boxColor: 'pink',
      });
    }, 2000);
  }

  paint({ context: ctx, props, state, childs }: Element) {
    console.log('box', this.props, this.$.props);
    const { color } = props;
    const { dot } = childs;
    const { boxColor } = state;

    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 100, 30);

    dot({ color: boxColor })
      .paste({ x: 10, y: 10 });
  }
}
