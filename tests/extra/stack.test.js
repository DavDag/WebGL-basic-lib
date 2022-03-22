/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {MatrixStack, Mat4} from "lib/all.js";

test("MatrixStack Constructor", () => {
  const stack = new MatrixStack();
  expect(stack.size()).toBe(0);
  expect(stack.head()).toBeUndefined();
  expect(stack.pop()).toBeUndefined();
});

test("MatrixStack Size", () => {
  const a = Mat4.Identity();
  const stack = new MatrixStack();
  expect(stack.size()).toBe(0);
  stack.push(a);
  expect(stack.size()).toBe(1);
  stack.push(a);
  expect(stack.size()).toBe(2);
  stack.pop();
  stack.push(a);
  expect(stack.size()).toBe(2);
  stack.pop();
  stack.pop();
  stack.pop();
  stack.pop();
  expect(stack.size()).toBe(0);
  stack.push(a);
  stack.pop();
  stack.push(a);
  stack.push(a);
  stack.push(a);
  stack.pop();
  stack.push(a);
  expect(stack.size()).toBe(3);
});

test("MatrixStack Push", () => {
  const stack = new MatrixStack();
  const a = Mat4.Identity();
  const b = Mat4.All(2);
  const c = Mat4.Identity();
  c.apply(a);
  expect(global.CmpMatToMat(stack.push(a), c)).toBe(true);
  c.apply(b);
  expect(global.CmpMatToMat(stack.push(b), c)).toBe(true);
  c.apply(b);
  expect(global.CmpMatToMat(stack.push(b), c)).toBe(true);
  c.apply(a);
  expect(global.CmpMatToMat(stack.push(a), c)).toBe(true);
  const d = Mat4.Identity();
  stack.pop();
  stack.pop();
  d.apply(a).apply(b).apply(a);
  expect(global.CmpMatToMat(stack.push(a), d)).toBe(true);
  d.apply(a);
  expect(global.CmpMatToMat(stack.push(a), d)).toBe(true);
});

test("MatrixStack DEPTH_LIMIT", () => {
  const stack = new MatrixStack();
  const a = Mat4.Identity();
  for (let i = 0; i < stack.DEPTH_LIMIT - 1; ++i) expect(() => stack.push(a)).not.toThrow();
  expect(() => stack.push(a)).toThrow();
  expect(() => stack.push(a)).toThrow();
  const N = 5;
  stack.DEPTH_LIMIT += N;
  for (let i = 1; i < N - 1; ++i) expect(() => stack.push(a)).not.toThrow();
  expect(() => stack.push(a)).toThrow();
  expect(() => stack.push(a)).toThrow();
});

test("MatrixStack Head", () => {
  const stack = new MatrixStack();
  const a = Mat4.Identity();
  const b = Mat4.All(2);
  const c = Mat4.Identity();
  c.apply(a);
  stack.push(a);
  expect(global.CmpMatToMat(stack.head(), c)).toBe(true);
  c.apply(b);
  stack.push(b);
  expect(global.CmpMatToMat(stack.head(), c)).toBe(true);
  c.apply(b);
  stack.push(b);
  expect(global.CmpMatToMat(stack.head(), c)).toBe(true);
  c.apply(a);
  stack.push(a);
  expect(global.CmpMatToMat(stack.head(), c)).toBe(true);
  const d = Mat4.Identity();
  stack.pop();
  stack.pop();
  d.apply(a).apply(b).apply(a);
  stack.push(a);
  expect(global.CmpMatToMat(stack.head(), d)).toBe(true);
  d.apply(a);
  stack.push(a);
  expect(global.CmpMatToMat(stack.head(), d)).toBe(true);
});

test("MatrixStack Pop", () => {
  const stack = new MatrixStack();
  const a = Mat4.Identity();
  const b = Mat4.All(2);
  const c = Mat4.All(3);
  expect(stack.pop()).toBeUndefined();
  stack.push(b);
  expect(global.CmpMatToMat(stack.pop(), b)).toBe(true);
  stack.push(c);
  expect(global.CmpMatToMat(stack.pop(), c)).toBe(true);
  stack.push(b);
  stack.push(c);
  a.apply(b).apply(c);
  expect(global.CmpMatToMat(stack.pop(), a)).toBe(true);
});
