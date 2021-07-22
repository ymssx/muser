import { Muse } from '../src/index';
import Wrapper from './components/wrapper';

const canvas = document.querySelector('#canvas');

const muse = new Muse([
  new Wrapper({
    canvas,
    width: 300,
    height: 200,
  }),
]);

muse.paint();
