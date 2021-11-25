import { Element } from '../../src/index';
import Box from './box';

export default class Test extends Element {
  constructor(config: any) {
    super(config);

    const row = [];
    for (let i = 0; i < 200; i++) {
      const col = [];
      for (let j = 0; j < 200; j++) {
        col.push([
          Math.ceil(Math.random() * 1910),
          Math.ceil(Math.random() * 1910),
          2 * ( Math.random() - 0.5),
          2 * (Math.random() - 0.5),
        ]);
      }
      row.push(col);
    }

    this.state = {
      boxColor: 'blue',
      p: row,
    };
  }

  box = new Box({ width: 90, height: 90 });

  getNewPlace(x: number, y: number, sx: number, sy: number) {
    const STEP = 5;
    let newX = x;
    let newY = y;
    let newSx = sx;
    let newSy = sy;
    if (x + sx * STEP > 1910 || x + sx * STEP < 0) {
      newSx *= -1;
    }
    if (y + sy * STEP > 1910 || y + sy * STEP < 0) {
      newSy *= -1;
    }
    newX += sx * STEP;
    newY += sy * STEP;
    return [newX, newY, newSx, newSy];
  }

  move() {
    requestAnimationFrame(() => {
      const { p } = this.state as any;
      for (let i = 0; i < 200; i++) {
        for (let j = 0; j < 200; j++) {
          const [x, y, sx, sy] = p[i][j];
          p[i][j] = this.getNewPlace(x, y, sx, sy);
        }
      }
      this.setState({
        boxColor: this.state.boxColor,
        p,
      })
      this.move();
    })
  }

  created() {
    setTimeout(() => {
      console.log('update');
      this.setState({
        boxColor: 'green',
        p: this.state.p,
      });
    }, 3000);
    this.move();
  }

  render({ context: ctx, props, state, childs }: Element) {
    const { box } = childs;
    const { boxColor, p } = state as any;

    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 2000, 2000);

    const boxContent = box({ color: boxColor })
      .slot(({ context }) => {
        context.fillStyle = '#000';
        context.font = "24px serif";
        context.fillText('YAMI', 20, 20);
      });

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        const [i, j] = p[x][y];
        boxContent
          .process(({ context }) => {
            context.font = "24px serif";
            context.fillText(String(20 * x + y), 30, 45);
          })
          .paste({
            x: i,
            y: j,
          });
      }
    }
  }
}