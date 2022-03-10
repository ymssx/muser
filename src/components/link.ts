import { Element } from '../index';

export default class Link extends Element {
  state = {
    activate: false,
  };

  created() {
    this.addEventListener('in', () => {
      this.setState({
        activate: true,
      });
      this.changeCursor('pointer');
    });
    this.addEventListener('out', () => {
      this.setState({
        activate: false,
      });
      this.changeCursor('default');
    });
    this.addEventListener('click', () => {
      window.open(this.props?.href as string);
    });
  }

  render({ props, state }: any) {
    const COLOR = '#3370ff';

    return [
      (ctx: CanvasRenderingContext2D) => {
        const { text } = props;

        ctx.font = '14px normal';
        ctx.fillStyle = COLOR;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 15);
      },
      (ctx: CanvasRenderingContext2D) => {
        const { text } = props;
        const { activate } = state;

        ctx.font = '14px normal';
        ctx.fillStyle = COLOR;
        ctx.textBaseline = 'middle';

        if (activate) {
          ctx.strokeStyle = COLOR;
          ctx.lineWidth = 1;
          ctx.moveTo(0, 21.5);
          ctx.lineTo(ctx.measureText(text).width, 21.5);
          ctx.stroke();
        } else {
          ctx.clearRect(0, 21, ctx.measureText(text).width, 2);
        }
      },
    ];
  }
}
