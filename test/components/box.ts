import { Element } from '../../src/index';

export default class Box extends Element {
  paint({ context: ctx, props }: Element) {
    console.log('box', this.props, this.$.props);
    const { color } = props;

    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 100, 30);
  }
}
