import { Element } from '../../src/index';

export default class Box extends Element {
  paint() {
    console.log('box', this.props, this.$.props);
    const ctx = this.context;
    const { color } = this.props;

    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 100, 30);
  }
}
