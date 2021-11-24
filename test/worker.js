import { Muse } from '../src/index';
import Wrapper from './components/wrapper';

const muse = new Muse([
  new Wrapper({
    canvas: 'wrapper',
    width: 1000,
    height: 1000,
  }),
]);
