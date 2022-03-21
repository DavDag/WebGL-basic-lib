/** @author: Davide Risaliti davdag24@gmail.com */

import { expect, test } from '@jest/globals';
import { Mat4, Vec3, Vec4, toRad } from "../all";

test("Mat4 Count", () => {
	expect(Mat4.count()).toBe(16);
});

test("Mat4 Side", () => {
	expect(Mat4.side()).toBe(4);
});

test("Mat4 Constructor", () => {
  const mat = new Mat4(1, 2, 3, 4,
                       1, 2, 3, 4,
                       1, 2, 3, 4,
                       1, 2, 3, 4);
  const expected = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Zeros", () => {
	const mat = Mat4.Zeros();
  const expected = new Array(16).fill(0);
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Ones", () => {
	const mat = Mat4.Ones();
  const expected = new Array(16).fill(1);
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 All", () => {
	const mat = Mat4.All(2.534);
  const expected = new Array(16).fill(2.534);
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 FromArrayCM", () => {
	const mat = Mat4.FromArrayCM([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  const expected = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 FromArrayRM", () => {
	const mat = Mat4.FromArrayRM([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  const expected = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Identity", () => {
	const mat = Mat4.Identity();
  const expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Getter", () => {
  const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	expect(mat.get(0, 0)).toBeCloseTo(0);
	expect(mat.get(0, 1)).toBeCloseTo(1);
	expect(mat.get(0, 2)).toBeCloseTo(2);
	expect(mat.get(0, 3)).toBeCloseTo(3);
	expect(mat.get(1, 0)).toBeCloseTo(4);
	expect(mat.get(1, 1)).toBeCloseTo(5);
	expect(mat.get(1, 2)).toBeCloseTo(6);
	expect(mat.get(1, 3)).toBeCloseTo(7);
	expect(mat.get(2, 0)).toBeCloseTo(8);
	expect(mat.get(2, 1)).toBeCloseTo(9);
	expect(mat.get(2, 2)).toBeCloseTo(10);
	expect(mat.get(2, 3)).toBeCloseTo(11);
	expect(mat.get(3, 0)).toBeCloseTo(12);
	expect(mat.get(3, 1)).toBeCloseTo(13);
	expect(mat.get(3, 2)).toBeCloseTo(14);
	expect(mat.get(3, 3)).toBeCloseTo(15);
});

test("Mat4 Setter", () => {
  const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	mat.set(0, 0, -1);
	mat.set(1, 0, -1);
	mat.set(0, 2, -1);
  mat.set(3, 1, -1);
  const expected = [-1, -1, 8, 12, 1, 5, 9, -1, -1, 6, 10, 14, 3, 7, 11, 15];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Row", () => {
  const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	expect(global.CmpVecToArr(mat.row(0), [ 0,  1,  2,  3])).toBe(true);
	expect(global.CmpVecToArr(mat.row(1), [ 4,  5,  6,  7])).toBe(true);
	expect(global.CmpVecToArr(mat.row(2), [ 8,  9, 10, 11])).toBe(true);
	expect(global.CmpVecToArr(mat.row(3), [12, 13, 14, 15])).toBe(true);
});

test("Mat4 Col", () => {
  const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	expect(global.CmpVecToArr(mat.col(0), [ 0,  4,  8, 12])).toBe(true);
	expect(global.CmpVecToArr(mat.col(1), [ 1,  5,  9, 13])).toBe(true);
	expect(global.CmpVecToArr(mat.col(2), [ 2,  6, 10, 14])).toBe(true);
	expect(global.CmpVecToArr(mat.col(3), [ 3,  7, 11, 15])).toBe(true);
});

test("Mat4 Det", () => {
  const mat = new Mat4(1, 2, 3, 4,
                       2, 3, 5, 6,
                       1, 4, 5, 6,
                       2, 5, 6, 7);
	expect(mat.det()).toBeCloseTo(2);
});

test("Mat4 Transpose", () => {
	const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	mat.transpose();
  const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Inverse", () => {
  const mat = new Mat4(1, 2, 3, 4,
                       2, 3, 5, 6,
                       1, 4, 5, 6,
                       2, 5, 6, 7);
	mat.inverse().round(2);
  const expected = [0.5, 0.5, -3.5, 2.5, 0, -1, 2, -1, -1.5, -0.5, 1.5, -0.5, 1, 1, -1, 0];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Translate", () => {
	const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	mat.translate(Vec4.Ones());
  const expected = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 6, 22, 38, 54];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Scale", () => {
	const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
	mat.scale(new Vec4(2, 3, 4));
  const expected = [0, 8, 16, 24, 3, 15, 27, 39, 8, 24, 40, 56, 3, 7, 11, 15];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Rotate", () => {
	const mat = new Mat4( 0,  1,  2,  3,
                        4,  5,  6,  7,
                        8,  9, 10, 11,
                       12, 13, 14, 15);
  const axe = new Vec3(2, 3, 4).normalize();
  mat.rotate(toRad(90), axe).round(2);
  const expected = [0.39, 3.61, 6.84, 10.06, 1.88, 4.12, 6.36, 8.60, 1.15, 6.85, 12.56, 18.27, 3, 7, 11, 15];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Multiply", () => {
	const mat1 = new Mat4( 0,  1,  2,  3,
                         4,  5,  6,  7,
                         8,  9, 10, 11,
                        12, 13, 14, 15);
  const mat2 = new Mat4( 0,  1,  2,  3,
                         4,  5,  6,  7,
                         8,  9, 10, 11,
                        12, 13, 14, 15);
	mat1.apply(mat2);
  const expected = [56, 152, 248, 344, 62, 174, 286, 398, 68, 196, 324, 452, 74, 218, 362, 506];
	expect(global.CmpMatToArr(mat1, expected)).toBe(true);
});

test("Mat4 LookAt", () => {
  const mat = Mat4.LookAt(new Vec3(0, 0, 2), new Vec3(1, 2, 3), new Vec3(0, 1, 0));
  mat.round(2);
  const expected = [-0.71, -0.58, -0.41, 0, 0, 0.58, -0.82, 0, 0.71, -0.58, -0.41, 0, -1.41, 1.15, 0.82, 1];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});

test("Mat4 Perspective", () => {
  const mat = Mat4.Perspective(toRad(45), 1, 0.1, 100);
  mat.round(2);
  const expected = [2.41, 0, 0, 0, 0, 2.41, 0, 0, 0, 0, -1, -1, 0, 0, -0.20, 0];
	expect(global.CmpMatToArr(mat, expected)).toBe(true);
});
