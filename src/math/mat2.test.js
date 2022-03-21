/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Mat2, Vec2, toRad} from "../all";

test("Mat2 Count", () => {
  expect(Mat2.count()).toBe(4);
});

test("Mat2 Side", () => {
  expect(Mat2.side()).toBe(2);
});

test("Mat2 Constructor", () => {
  const a = new Mat2(1, 2,
                     1, 2);
  expect(global.CmpMatToArr(a, [1, 1, 2, 2])).toBe(true);
});

test("Mat2 Zeros", () => {
  const a = Mat2.Zeros();
  expect(global.CmpMatToArr(a, new Array(4).fill(0))).toBe(true);
});

test("Mat2 Ones", () => {
  const a = Mat2.Ones();
  expect(global.CmpMatToArr(a, new Array(4).fill(1))).toBe(true);
});

test("Mat2 All", () => {
  const a = Mat2.All(2.534);
  expect(global.CmpMatToArr(a, new Array(4).fill(2.534))).toBe(true);
});

test("Mat2 FromArrayCM", () => {
  const a = Mat2.FromArrayCM([1, 2, 1, 2]);
  expect(global.CmpMatToArr(a, [1, 2, 1, 2])).toBe(true);
});

test("Mat2 FromArrayRM", () => {
  const a = Mat2.FromArrayRM([1, 2, 1, 2]);
  expect(global.CmpMatToArr(a, [1, 1, 2, 2])).toBe(true);
});

test("Mat2 Identity", () => {
  const a = Mat2.Identity();
  expect(global.CmpMatToArr(a, [1, 0, 0, 1])).toBe(true);
});

test("Mat2 Getter", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  expect(a.get(0, 0)).toBeCloseTo(0);
  expect(a.get(0, 1)).toBeCloseTo(1);
  expect(a.get(1, 0)).toBeCloseTo(2);
  expect(a.get(1, 1)).toBeCloseTo(3);
});

test("Mat2 Setter", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  a.set(0, 0, -1);
  a.set(1, 0, -1);
  expect(global.CmpMatToArr(a, [-1, -1, 1, 3])).toBe(true);
});

test("Mat2 Row", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  expect(global.CmpVecToArr(a.row(0), [0, 1])).toBe(true);
  expect(global.CmpVecToArr(a.row(1), [2, 3])).toBe(true);
});

test("Mat2 Col", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  expect(global.CmpVecToArr(a.col(0), [0, 2])).toBe(true);
  expect(global.CmpVecToArr(a.col(1), [1, 3])).toBe(true);
});

test("Mat2 Det", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  expect(a.det()).toBeCloseTo(-2);
});

test("Mat2 Transpose", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  a.transpose();
  expect(global.CmpMatToArr(a, [0, 1, 2, 3])).toBe(true);
});

test("Mat2 Inverse", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  a.inverse();
  expect(global.CmpMatToArr(a, [-1.5, 1, 0.5, 0])).toBe(true);
});

test("Mat2 Scale", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  a.scale(new Vec2(2, 3));
  expect(global.CmpMatToArr(a, [0, 4, 3, 9])).toBe(true);
});

test("Mat2 Rotate", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  a.rotate(toRad(90)).round(2);
  expect(global.CmpMatToArr(a, [1, 3, 0, -2])).toBe(true);
});

test("Mat2 Multiply", () => {
  const a = new Mat2(0, 1,
                     2, 3);
  const b = new Mat2(0, 1,
                     2, 3);
  a.apply(b);
  expect(global.CmpMatToArr(a, [2, 6, 3, 11])).toBe(true);
});
