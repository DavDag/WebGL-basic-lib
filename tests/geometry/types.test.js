/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Shape, BasicShape, TexturedShape, DebugShape, AdvancedShape, RealisticShape} from 'lib/all.js';
import {Vec2, Vec3, Vec4} from "lib/all.js";

test("BasicShape VertexSize", () => {
  expect(BasicShape.VertexSize()).toBe(3);
});

test("TexturedShape VertexSize", () => {
  expect(TexturedShape.VertexSize()).toBe(5);
});

test("AdvancedShape VertexSize", () => {
  expect(AdvancedShape.VertexSize()).toBe(8);
});

test("RealisticShape VertexSize", () => {
  expect(RealisticShape.VertexSize()).toBe(11);
});

test("DebugShape VertexSize", () => {
  expect(DebugShape.VertexSize()).toBe(11);
});

test("Shape FlattenVecArray", () => {
  const N = 4;
  const arr2 = new Array(N).fill(0).map((_) => Vec2.All(2));
  const expected2 = new Array(N * 2).fill(2);
  expect(global.CmpArrToArr(Shape.FlattenVecArray(arr2), expected2)).toBe(true);
  const arr3 = new Array(N).fill(0).map((_) => Vec3.All(3));
  const expected3 = new Array(N * 3).fill(3);
  expect(global.CmpArrToArr(Shape.FlattenVecArray(arr3), expected3)).toBe(true);
  const arr4 = new Array(N).fill(0).map((_) => Vec4.All(4));
  const expected4 = new Array(N * 4).fill(4);
  expect(global.CmpArrToArr(Shape.FlattenVecArray(arr4), expected4)).toBe(true);
});

test("Shape FlattenVecArrays", () => {
  const N = 4;
  const arr2 = new Array(N).fill(0).map((_) => Vec2.All(2));
  const arr3 = new Array(N).fill(0).map((_) => Vec3.All(3));
  const arr4 = new Array(N).fill(0).map((_) => Vec4.All(4));  
  const expected = new Array(N).fill(null).map((_) => [
    ...new Array(2).fill(2), ...new Array(3).fill(3), ...new Array(4).fill(4)
  ]).flat();
  expect(global.CmpArrToArr(Shape.FlattenVecArrays([arr2, arr3, arr4]), expected)).toBe(true);
});
