import { Element, Brush, useElement } from '@/muser/index';
import Box from './box';

export default class App extends Element<{ value: string }> {
  constructor(config) {
    super(config);
    this.state = { width: 200, color: 'green', top: 10 };
  }

  created() {
    this.smoothState({ top: 500 }, 1000);
    setTimeout(() => {
      this.setState({ color: 'blue' });
    }, 500);
  }

  render({ data }: App) {
    const child = useElement(Box, {
      width: 100,
      height: 100,
      key: 'key-of-child-element',
    });

    // re-render when 'width' or 'value' or 'color' was changed
    return ({ clear, rect }: Brush) => {
      const { width, color, top } = data;

      clear();

      rect([0, 0, width, width], { fillStyle: color });

      child({ color })
        .paste({  x: 100, y: top });
    };
  }
}
