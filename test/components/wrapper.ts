import { Element } from '../../src/index';
import Box from './box';

export default class Test extends Element {
  constructor(config: any) {
    super(config);
    this.childMap = {
      box1: new Box({ width: 100, height: 100 }),
    };
    this.state = {
      boxColor: 'blue',
      count: 1,
    };
  }

  created() {
    setTimeout(() => {
      console.log('update');
      this.setState({
        boxColor: 'green',
        count: 4,
      });
    }, 3000);
  }

  paint({ context: ctx, props, state, childs }: Element) {
    console.log('wrapper', props, state.boxColor);
    const { box1 } = childs;
    const { boxColor, count } = state;

    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 300, 300);

    box1({
      color: boxColor,
      count,
    })
      .paste({
        x: 10,
        y: 10,
      })
      .paste({
        x: 10,
        y: 50,
      });

    box1({
      color: 'dark',
      count: 2,
    })
      .paste({
        x: 10,
        y: 90,
      });

    box1({
      color: 'orange',
      count: 3,
    })
      .paste({
        x: 10,
        y: 130,
      });
  }
}