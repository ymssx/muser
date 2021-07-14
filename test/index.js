import { Muse } from '../src/index';
import Wrapper from './components/wrapper';

const canvas = document.querySelector('#canvas');
const muse = new Muse();
const layer = muse.createLayer(canvas, {
  width: 300,
  height: 200,
});
layer.addChilds({
  root: new Wrapper(),
});
console.log(layer);
console.log(layer.childs.root);

muse.render();
