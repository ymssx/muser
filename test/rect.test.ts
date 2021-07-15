import { haveIntersection, Position } from "../src/render/renderTree";

const checkList: [Position, Position, boolean][] = [
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 0, y: 0, w: 3, h: 2 }, true],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 2, y: 2, w: 2, h: 2 }, false],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 1, y: 1, w: 2, h: 2 }, true],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 3, y: 0, w: 2, h: 2 }, false],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 0, y: 0, w: 2, h: 2 }, true],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 0, y: 3, w: 2, h: 2 }, false],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 2, y: 2, w: 2, h: 2 }, false],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 0, y: 0, w: 0, h: 0 }, false],
  [{ x: 0, y: 0, w: 2, h: 2 }, { x: 1, y: 1, w: 0, h: 0 }, true],
];

checkList.forEach(([a, b, answer], index: number) => {
  const res = haveIntersection(a, b);
  test(`test ${index} group`, () => {
    expect(res).toBe(answer);
  });
});