import { Muse } from '../src/index';
import Wrapper from './components/wrapper';

const muse = new Muse([
  new Wrapper({
    canvas: document.querySelector('#canvas'),
    width: 2000,
    height: 2000,
  }),
]);

muse.paint();
