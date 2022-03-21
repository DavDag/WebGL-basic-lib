
import {expect, test} from '@jest/globals';
import {Mat2, Vec2} from "../all";

test("Vec2 Count", () => {
    expect(Vec2.count()).toBe(2);
});

test("Vec2 Constructor", () => {
    expect(global.CmpVecToArr(new Vec2(1, 2), [1, 2])).toBe(true);
});

test("Vec2 Zeros", () => {
    expect(global.CmpVecToArr(Vec2.Zeros(), new Array(2).fill(0))).toBe(true);
});

test("Vec2 Ones", () => {
    expect(global.CmpVecToArr(Vec2.Ones(), new Array(2).fill(1))).toBe(true);
});

test("Vec2 All", () => {
    expect(global.CmpVecToArr(Vec2.All(2.534), new Array(2).fill(2.534))).toBe(true);
});

test("Vec2 FromArray", () => {
    expect(global.CmpVecToArr(Vec2.FromArray([1, 2]), [1, 2])).toBe(true);
});

test("Vec2 Getter", () => {
    const vec = new Vec2(1, 2);
    expect(vec.x).toBeCloseTo(1);
    expect(vec.y).toBeCloseTo(2);
    expect(vec.w).toBeCloseTo(1);
    expect(vec.h).toBeCloseTo(2);
    expect(vec.u).toBeCloseTo(1);
    expect(vec.v).toBeCloseTo(2);
});

test("Vec2 Setter", () => {
    const vec = new Vec2(1, 2);
    vec.x = 2;
    vec.y += 2;
    expect(global.CmpVecToArr(vec, [2, 4])).toBe(true);
    vec.w = 3;
    vec.h += 2;
    expect(global.CmpVecToArr(vec, [3, 6])).toBe(true);
    vec.u = 4;
    vec.v += 2;
    expect(global.CmpVecToArr(vec, [4, 8])).toBe(true);
});

test("Vec2 ToString", () => {
    const vec = new Vec2(1, 2);
    expect(vec.toString(0)).toBe("[1,2]");
    expect(vec.toString(1)).toBe("[1.0,2.0]");
    expect(vec.toString(2)).toBe("[1.00,2.00]");
    expect(vec.toString()).toBe(vec.toString(20));
});

test("Vec2 Add", () => {
    const a = Vec2.Zeros();
    const b = Vec2.Zeros();
    const c = Vec2.Zeros();
    const o = new Vec2(1, 2);
    expect(global.CmpVecToArr(a.add(o), [1, 2])).toBe(true);
    expect(global.CmpVecToArr(b.add(o).add(o), [2, 4])).toBe(true);
    c.add(o);
    expect(global.CmpVecToArr(c, [1, 2])).toBe(true);
});

test("Vec2 Sub", () => {
    const a = Vec2.Zeros();
    const b = Vec2.Zeros();
    const c = Vec2.Zeros();
    const o = new Vec2(1, 2);
    expect(global.CmpVecToArr(a.sub(o), [-1, -2])).toBe(true);
    expect(global.CmpVecToArr(b.sub(o).sub(o), [-2, -4])).toBe(true);
    c.sub(o);
    expect(global.CmpVecToArr(c, [-1, -2])).toBe(true);
});

test("Vec2 Mul", () => {
    const a = Vec2.Ones();
    const b = Vec2.Ones();
    const c = new Vec2(1, 2);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.mul(f), [f, f])).toBe(true);
    expect(global.CmpVecToArr(b.mul(f).mul(f), [f * f, f * f])).toBe(true);
    c.mul(f);
    expect(global.CmpVecToArr(c, [f, 2 * f])).toBe(true);
});

test("Vec2 Div", () => {
    const a = Vec2.Ones();
    const b = Vec2.Ones();
    const c = new Vec2(1, 2);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.div(f), [1 / f, 1 / f])).toBe(true);
    expect(global.CmpVecToArr(b.div(f).div(f), [1 / f / f, 1 / f / f])).toBe(true);
    c.div(f);
    expect(global.CmpVecToArr(c, [1 / f, 2 / f])).toBe(true);
});

test("Vec2 Dot", () => {
    const a = Vec2.Zeros();
    const b = Vec2.Ones();
    const c = new Vec2(1, 2);
    expect(a.dot(b)).toBeCloseTo(0);
    expect(a.dot(c)).toBeCloseTo(0);
    expect(b.dot(c)).toBeCloseTo(3);
    expect(c.dot(c)).toBeCloseTo(5);
});

test("Vec2 Magnitude", () => {
    const a = Vec2.Zeros();
    const b = Vec2.Ones();
    const c = new Vec2(1, 2);
    expect(a.magnitude()).toBeCloseTo(0);
    expect(b.magnitude()).toBeCloseTo(Math.sqrt(2));
    expect(c.magnitude()).toBeCloseTo(Math.sqrt(5));
});

test("Vec2 MagnitudeSquared", () => {
    const a = Vec2.Zeros();
    const b = Vec2.Ones();
    const c = new Vec2(1, 2);
    expect(a.magnitudeSquared()).toBeCloseTo(0);
    expect(b.magnitudeSquared()).toBeCloseTo(2);
    expect(c.magnitudeSquared()).toBeCloseTo(5);
});

test("Vec2 Clone", () => {
    const a = Vec2.Ones();
    const b = a.clone();
    b.x = 2;
    expect(global.CmpVecToArr(a, [1, 1])).toBe(true);
    expect(global.CmpVecToArr(b, [2, 1])).toBe(true);
});

test("Vec2 Equals", () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(1, 2);
    const c = a.clone().div(4).mul(4);
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
    expect(a.equals(c)).toBe(true);
    expect(c.equals(a)).toBe(true);
    expect(a.equals(Vec2.Zeros())).toBe(false);
});

test("Vec2 Round", () => {
    const a = new Vec2(1.3456, 2.3456);
    expect(global.CmpVecToArr(a.clone().round(0), [1, 2])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(1), [1.3, 2.3])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(2), [1.35, 2.35])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(3), [1.346, 2.346])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(4), [1.3456, 2.3456])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(5), [1.34560, 2.34560])).toBe(true);
});

test("Vec2 Normalize", () => {
    const a = new Vec2(1, 0).normalize();
    const b = new Vec2(1, 2).normalize().round(2);
    expect(global.CmpVecToArr(a, [1, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [0.45, 0.89])).toBe(true);
});

test("Vec2 Inverse", () => {
    const a = new Vec2(1, 0).inverse();
    const b = new Vec2(1, 2).inverse().round(2);
    expect(global.CmpVecToArr(a, [1, Number.POSITIVE_INFINITY])).toBe(true);
    expect(global.CmpVecToArr(b, [1, 0.5])).toBe(true);
});

test("Vec2 Negate", () => {
    const a = new Vec2(1, 0).negate();
    const b = new Vec2(1, 2).negate();
    expect(global.CmpVecToArr(a, [-1, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [-1, -2])).toBe(true);
});

test("Vec2 Transform", () => {
    const a = new Vec2(1, 2);
    const m = new Mat2(0, 1, 2, 3);
    a.transform(m);
    expect(global.CmpVecToArr(a, [2, 8])).toBe(true);
});

test("Vec2 to Vec3", () => {
    const a = new Vec2(1, 2);
    const b = a.toVec3(3);
    expect(global.CmpVecToArr(b, [1, 2, 3])).toBe(true);
});

test("Vec2 to Vec4", () => {
    const a = new Vec2(1, 2);
    const b = a.toVec4(3, 4);
    expect(global.CmpVecToArr(b, [1, 2, 3, 4])).toBe(true);
});
  