/** @author: Davide Risaliti davdag24@gmail.com */

import { expect, test } from '@jest/globals';
import { Mat3, Vec3, toRad } from "lib/all.js";

test("Mat3 Count", () => {
	expect(Mat3.count()).toBe(9);
});

test("Mat3 Side", () => {
	expect(Mat3.side()).toBe(3);
});

test("Mat3 Constructor", () => {
	const a = new Mat3(1, 2, 3,
										 1, 2, 3,
										 1, 2, 3);
	expect(global.CmpMatToArr(a, [1, 1, 1, 2, 2, 2, 3, 3, 3])).toBe(true);
});

test("Mat3 Zeros", () => {
	const a = Mat3.Zeros();
	expect(global.CmpMatToArr(a, new Array(9).fill(0))).toBe(true);
});

test("Mat3 Ones", () => {
	const a = Mat3.Ones();
	expect(global.CmpMatToArr(a, new Array(9).fill(1))).toBe(true);
});

test("Mat3 All", () => {
	const a = Mat3.All(2.534);
	expect(global.CmpMatToArr(a, new Array(9).fill(2.534))).toBe(true);
});

test("Mat3 FromArrayCM", () => {
	const a = Mat3.FromArrayCM([1, 2, 3, 1, 2, 3, 1, 2, 3]);
	expect(global.CmpMatToArr(a, [1, 2, 3, 1, 2, 3, 1, 2, 3])).toBe(true);
});

test("Mat3 FromArrayRM", () => {
	const a = Mat3.FromArrayRM([1, 2, 3, 1, 2, 3, 1, 2, 3]);
	expect(global.CmpMatToArr(a, [1, 1, 1, 2, 2, 2, 3, 3, 3])).toBe(true);
});

test("Mat3 Identity", () => {
	const a = Mat3.Identity();
	expect(global.CmpMatToArr(a, [1, 0, 0, 0, 1, 0, 0, 0, 1])).toBe(true);
});

test("Mat3 Getter", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	expect(a.get(0, 0)).toBeCloseTo(0);
	expect(a.get(0, 1)).toBeCloseTo(1);
	expect(a.get(0, 2)).toBeCloseTo(2);
	expect(a.get(1, 0)).toBeCloseTo(3);
	expect(a.get(1, 1)).toBeCloseTo(4);
	expect(a.get(1, 2)).toBeCloseTo(5);
	expect(a.get(2, 0)).toBeCloseTo(6);
	expect(a.get(2, 1)).toBeCloseTo(7);
	expect(a.get(2, 2)).toBeCloseTo(8);
});

test("Mat3 Setter", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.set(0, 0, -1);
	a.set(1, 0, -1);
	a.set(0, 2, -1);
	expect(global.CmpMatToArr(a, [-1, -1, 6, 1, 4, 7, -1, 5, 8])).toBe(true);
});

test("Mat3 Row", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	expect(global.CmpVecToArr(a.row(0), [0, 1, 2])).toBe(true);
	expect(global.CmpVecToArr(a.row(1), [3, 4, 5])).toBe(true);
	expect(global.CmpVecToArr(a.row(2), [6, 7, 8])).toBe(true);
});

test("Mat3 Col", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	expect(global.CmpVecToArr(a.col(0), [0, 3, 6])).toBe(true);
	expect(global.CmpVecToArr(a.col(1), [1, 4, 7])).toBe(true);
	expect(global.CmpVecToArr(a.col(2), [2, 5, 8])).toBe(true);
});

test("Mat3 Det", () => {
	const a = new Mat3(1, 3, 2,
										 1, 4, 3,
										 2, 2, 4);
	expect(a.det()).toBeCloseTo(4);
});

test("Mat3 Transpose", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.transpose();
	expect(global.CmpMatToArr(a, [0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
});

test("Mat3 Inverse", () => {
	const a = new Mat3(1, 1, 2,
										 3, 4, 2,
										 2, 3, 4);
	a.inverse().round(2);
	expect(global.CmpMatToArr(a, [2.5, -2, 0.25, 0.5, 0, -0.25, -1.5, 1, 0.25])).toBe(true);
});

test("Mat3 Translate", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.translate(Vec3.Ones());
	expect(global.CmpMatToArr(a, [0, 3, 6, 1, 4, 7, 3, 12, 21])).toBe(true);
});

test("Mat3 Scale", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.scale(new Vec3(2, 3, 4));
	expect(global.CmpMatToArr(a, [0, 6, 12, 3, 12, 21, 2, 5, 8])).toBe(true);
});

test("Mat3 Rotate", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.rotate(toRad(90)).round(2);
	expect(global.CmpMatToArr(a, [1, 4, 7, 0, -3, -6, 2, 5, 8])).toBe(true);
});

test("Mat3 Multiply", () => {
	const a = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	const b = new Mat3(0, 1, 2,
										 3, 4, 5,
										 6, 7, 8);
	a.apply(b);
	expect(global.CmpMatToArr(a, [15, 42, 69, 18, 54, 90, 21, 66, 111])).toBe(true);
});
