import { Muse } from '../src/index';
import Wrapper from './components/wrapper';

const canvas = new OffscreenCanvas(100, 100);

const muse = new Muse([
  new Wrapper({
    canvas: 'wrapper',
    width: 300,
    height: 300,
  }),
]);
