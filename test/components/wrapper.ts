import { Element } from '../../src/index';
import Box from './box';

export default class Test extends Element {
  constructor(config: any) {
    super(config);
    this.state = {
      boxColor: 'blue',
    };
  }

  box = new Box({ width: 90, height: 90 });

  created() {
    setTimeout(() => {
      console.log('update');
      this.setState({
        boxColor: 'green',
      });
    }, 3000);
  }

  paint({ context: ctx, props, state, childs }: Element) {
    console.log('wrapper', props, state.boxColor);
    const { box } = childs;
    const { boxColor } = state;

    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 1000, 1000);

    const boxContent = box({ color: boxColor });
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        boxContent.paste({
          x: 5 + 100 * x,
          y: 5 + 100 * y,
        });
      }
    }
  }
}