/**
 * @jest-environment jsdom
 */

import { Muse } from '../src/index';
import Wrapper from './components/wrapper';
import { createCanvas } from '../src/utils/canvas';

test('is-browser-env', () => {
  expect(window).not.toBeUndefined();
});

const canvas = createCanvas(300, 200);

test('can-create-canvas', () => {
  expect(canvas).not.toBeUndefined();
});

const muse = new Muse();
const layer = muse.createLayer(canvas, {
  width: 300,
  height: 200,
});

layer.addChilds({
  root: new Wrapper(),
});

muse.paint();

test('test', () => {
  expect(layer.childs).not.toBeUndefined();
});
