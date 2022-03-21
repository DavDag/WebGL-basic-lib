/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {LinesFromTriangles} from "../all";
import {Vec2, Vec3} from "../all";

test("LinesFromTriangles: No intersection", () => {
  const vec = [
    Vec2.All(0), Vec2.All(1), Vec2.All(2),
    Vec2.All(3), Vec2.All(4), Vec2.All(5),
    Vec2.All(6), Vec2.All(7), Vec2.All(8)
  ];
  const tri = [
    new Vec3(0, 1, 2), new Vec3(3, 4, 5), new Vec3(6, 7, 8)
  ];
  const res = LinesFromTriangles(vec, tri);
  expect(res).toHaveLength(9);
  expect(global.CmpVecToArr(res[0], [0, 1])).toBe(true);
  expect(global.CmpVecToArr(res[1], [1, 2])).toBe(true);
  expect(global.CmpVecToArr(res[2], [2, 0])).toBe(true);
  expect(global.CmpVecToArr(res[3], [3, 4])).toBe(true);
  expect(global.CmpVecToArr(res[4], [4, 5])).toBe(true);
  expect(global.CmpVecToArr(res[5], [5, 3])).toBe(true);
  expect(global.CmpVecToArr(res[6], [6, 7])).toBe(true);
  expect(global.CmpVecToArr(res[7], [7, 8])).toBe(true);
  expect(global.CmpVecToArr(res[8], [8, 6])).toBe(true);
});

test("LinesFromTriangles: With intersection", () => {
  const vec = [
    Vec2.All(0), Vec2.All(1), Vec2.All(2),
    Vec2.All(3), Vec2.All(4), Vec2.All(5),
    Vec2.All(6), Vec2.All(7), Vec2.All(8)
  ];
  const tri = [
    new Vec3(0, 1, 2), new Vec3(0, 2, 3), new Vec3(1, 2, 5)
  ];
  const res = LinesFromTriangles(vec, tri);
  expect(res).toHaveLength(7);
  expect(global.CmpVecToArr(res[0], [0, 1])).toBe(true);
  expect(global.CmpVecToArr(res[1], [1, 2])).toBe(true);
  expect(global.CmpVecToArr(res[2], [2, 0])).toBe(true);
  expect(global.CmpVecToArr(res[3], [2, 3])).toBe(true);
  expect(global.CmpVecToArr(res[4], [3, 0])).toBe(true);
  expect(global.CmpVecToArr(res[5], [2, 5])).toBe(true);
  expect(global.CmpVecToArr(res[6], [5, 1])).toBe(true);
});

