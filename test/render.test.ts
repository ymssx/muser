/**
 * @jest-environment jsdom
 */

import { Muse } from '../src/index';
import Wrapper from './components/wrapper';
import { createCanvas } from '../src/utils/canvas';
import { paintRecord, record } from './utils/record';

test('is-browser-env', () => {
  expect(window).not.toBeUndefined();
});

const canvas = createCanvas(300, 200);

test('can-create-canvas', () => {
  expect(canvas).not.toBeUndefined();
});

const muse = new Muse([
  new Wrapper({
    canvas,
    width: 300,
    height: 200,
  }),
]);

test('test', () => {
  expect(muse.childs).not.toBeUndefined();
});

muse.paint();

test('test paint sequence', () => {

});
