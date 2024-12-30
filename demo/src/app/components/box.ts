import { Element } from '@/muser/index'

class Dot extends Element {
  render({ context: ctx, props }: Element) {
    const { color } = props;

    ctx.fillStyle = color as string || 'white';
    ctx.fillRect(0, 0, 8, 8);
  }
}

export default class Box extends Element {
  dot = new Dot({ width: 8, height: 8 });

  state = {
    boxColor: 'red',
  };

  created() {
    // setTimeout(() => {
    //   console.log('update');
    //   this.setState({
    //     boxColor: 'pink',
    //   });
    // }, 2000);
  }

  render({ context: ctx, props, state, childs }: Element) {
    const { color } = props as  { color: string, count: number };
    console.log('box render', color);
    const { dot } = childs;
    const { boxColor } = state;

    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 90, 90);

    const dotContext = dot({ color: boxColor });
    for (let x = 0; x < 9; x += 1) {
      for (let y = 0; y < 9; y += 1) {
        dotContext.paste({
          x: 1 + 10 * x,
          y: 1 + 10 * y,
        });
      }
    }

    this.slot();
  }
}
