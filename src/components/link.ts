import { Element } from '../index';

export default class Link extends Element {
  state = {
    activate: false,
  };

  created() {
    this.addEventListener('mousemove', () => {
      this.setState({
        activate: true,
      });
      this.changeCursor('pointer');
    });
    this.addEventListener('mouseout', () => {
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

        if (activate) {
          ctx.fillStyle = COLOR;
          ctx.fillRect(0, 20, ctx.measureText(text).width, 2);
        } else {
          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 20, ctx.measureText(text).width, 2);
        }
      },
    ];
  }
}
