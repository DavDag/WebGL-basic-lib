
import {expect, test} from '@jest/globals';
import {Mat4, Vec4} from "../all";

test("Vec4 Count", () => {
    expect(Vec4.count()).toBe(4);
});

test("Vec4 Constructor", () => {
    expect(global.CmpVecToArr(new Vec4(1, 2, 3, 4), [1, 2, 3, 4])).toBe(true);
});

test("Vec4 Zeros", () => {
    expect(global.CmpVecToArr(Vec4.Zeros(), new Array(4).fill(0))).toBe(true);
});

test("Vec4 Ones", () => {
    expect(global.CmpVecToArr(Vec4.Ones(), new Array(4).fill(1))).toBe(true);
});

test("Vec4 All", () => {
    expect(global.CmpVecToArr(Vec4.All(2.534), new Array(4).fill(2.534))).toBe(true);
});

test("Vec4 FromArray", () => {
    expect(global.CmpVecToArr(Vec4.FromArray([1, 2, 3, 4]), [1, 2, 3, 4])).toBe(true);
});

test("Vec4 Getter", () => {
    const vec = new Vec4(1, 2, 3, 4);
    expect(vec.x).toBeCloseTo(1);
    expect(vec.y).toBeCloseTo(2);
    expect(vec.z).toBeCloseTo(3);
    expect(vec.w).toBeCloseTo(4);
    expect(vec.r).toBeCloseTo(1);
    expect(vec.g).toBeCloseTo(2);
    expect(vec.b).toBeCloseTo(3);
    expect(vec.a).toBeCloseTo(4);
});

test("Vec4 Setter", () => {
    const vec = new Vec4(1, 2, 3, 4);
    vec.x = 2;
    vec.y += 2;
    vec.z += 3;
    vec.w += 4;
    expect(global.CmpVecToArr(vec, [2, 4, 6, 8])).toBe(true);
    vec.r = 3;
    vec.g += 2;
    vec.b += 3;
    vec.w += 4;
    expect(global.CmpVecToArr(vec, [3, 6, 9, 12])).toBe(true);
});

test("Vec4 ToString", () => {
    const vec = new Vec4(1, 2, 3, 4);
    expect(vec.toString(0)).toBe("[1,2,3,4]");
    expect(vec.toString(1)).toBe("[1.0,2.0,3.0,4.0]");
    expect(vec.toString(2)).toBe("[1.00,2.00,3.00,4.00]");
    expect(vec.toString()).toBe(vec.toString(20));
});

test("Vec4 Add", () => {
    const a = Vec4.Zeros();
    const b = Vec4.Zeros();
    const c = Vec4.Zeros();
    const o = new Vec4(1, 2, 3, 4);
    expect(global.CmpVecToArr(a.add(o), [1, 2, 3, 4])).toBe(true);
    expect(global.CmpVecToArr(b.add(o).add(o), [2, 4, 6, 8])).toBe(true);
    c.add(o);
    expect(global.CmpVecToArr(c, [1, 2, 3, 4])).toBe(true);
});

test("Vec4 Sub", () => {
    const a = Vec4.Zeros();
    const b = Vec4.Zeros();
    const c = Vec4.Zeros();
    const o = new Vec4(1, 2, 3, 4);
    expect(global.CmpVecToArr(a.sub(o), [-1, -2, -3, -4])).toBe(true);
    expect(global.CmpVecToArr(b.sub(o).sub(o), [-2, -4, -6, -8])).toBe(true);
    c.sub(o);
    expect(global.CmpVecToArr(c, [-1, -2, -3, -4])).toBe(true);
});

test("Vec4 Mul", () => {
    const a = Vec4.Ones();
    const b = Vec4.Ones();
    const c = new Vec4(1, 2, 3, 4);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.mul(f), [f, f, f, f])).toBe(true);
    expect(global.CmpVecToArr(b.mul(f).mul(f), [f * f, f * f, f * f, f * f])).toBe(true);
    c.mul(f);
    expect(global.CmpVecToArr(c, [f, 2 * f, 3 * f, 4 * f])).toBe(true);
});

test("Vec4 Div", () => {
    const a = Vec4.Ones();
    const b = Vec4.Ones();
    const c = new Vec4(1, 2, 3, 4);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.div(f), [1 / f, 1 / f, 1 / f, 1 / f])).toBe(true);
    expect(global.CmpVecToArr(b.div(f).div(f), [1 / f / f, 1 / f / f, 1 / f / f, 1 / f / f])).toBe(true);
    c.div(f);
    expect(global.CmpVecToArr(c, [1 / f, 2 / f, 3 / f, 4 / f])).toBe(true);
});

test("Vec4 Dot", () => {
    const a = Vec4.Zeros();
    const b = Vec4.Ones();
    const c = new Vec4(1, 2, 3, 4);
    expect(a.dot(b)).toBeCloseTo(0);
    expect(a.dot(c)).toBeCloseTo(0);
    expect(b.dot(c)).toBeCloseTo(10);
    expect(c.dot(c)).toBeCloseTo(30);
});

test("Vec4 Magnitude", () => {
    const a = Vec4.Zeros();
    const b = Vec4.Ones();
    const c = new Vec4(1, 2, 3, 4);
    expect(a.magnitude()).toBeCloseTo(0);
    expect(b.magnitude()).toBeCloseTo(Math.sqrt(4));
    expect(c.magnitude()).toBeCloseTo(Math.sqrt(30));
});

test("Vec4 MagnitudeSquared", () => {
    const a = Vec4.Zeros();
    const b = Vec4.Ones();
    const c = new Vec4(1, 2, 3, 4);
    expect(a.magnitudeSquared()).toBeCloseTo(0);
    expect(b.magnitudeSquared()).toBeCloseTo(4);
    expect(c.magnitudeSquared()).toBeCloseTo(30);
});

test("Vec4 Clone", () => {
    const a = Vec4.Ones();
    const b = a.clone();
    b.x = 2;
    expect(global.CmpVecToArr(a, [1, 1, 1, 1])).toBe(true);
    expect(global.CmpVecToArr(b, [2, 1, 1, 1])).toBe(true);
});

test("Vec4 Equals", () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(1, 2, 3, 4);
    const c = a.clone().div(4).mul(4);
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
    expect(a.equals(c)).toBe(true);
    expect(c.equals(a)).toBe(true);
    expect(a.equals(Vec4.Zeros())).toBe(false);
});

test("Vec4 Round", () => {
    const a = new Vec4(1.3456, 2.3456, 3.3456, 4.3456);
    expect(global.CmpVecToArr(a.clone().round(0), [1, 2, 3, 4])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(1), [1.3, 2.3, 3.3, 4.3])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(2), [1.35, 2.35, 3.35, 4.35])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(3), [1.346, 2.346, 3.346, 4.346])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(4), [1.3456, 2.3456, 3.3456, 4.3456])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(5), [1.34560, 2.34560, 3.34560, 4.34560])).toBe(true);
});

test("Vec4 Normalize", () => {
    const a = new Vec4(1, 0, 0, 0).normalize();
    const b = new Vec4(1, 2, 3, 4).normalize().round(2);
    expect(global.CmpVecToArr(a, [1, 0, 0, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [0.18, 0.37, 0.55, 0.73])).toBe(true);
});

test("Vec4 Inverse", () => {
    const a = new Vec4(1, 0, 0, 0).inverse();
    const b = new Vec4(1, 2, 3, 4).inverse().round(2);
    expect(global.CmpVecToArr(a, [1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY])).toBe(true);
    expect(global.CmpVecToArr(b, [1, 0.5, 0.33, 0.25])).toBe(true);
});

test("Vec4 Negate", () => {
    const a = new Vec4(1, 0, 0, 0).negate();
    const b = new Vec4(1, 2, 3, 4).negate();
    expect(global.CmpVecToArr(a, [-1, 0, 0, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [-1, -2, -3, -4])).toBe(true);
});

test("Vec4 Transform", () => {
    const a = new Vec4(1, 2, 3, 4);
    const m = new Mat4(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
    a.transform(m);
    expect(global.CmpVecToArr(a, [20, 60, 100, 140])).toBe(true);
});

test("Vec4 to Vec2", () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = a.toVec2();
    expect(global.CmpVecToArr(b, [1, 2])).toBe(true);
});

test("Vec4 to Vec3", () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = a.toVec3();
    expect(global.CmpVecToArr(b, [1, 2, 3])).toBe(true);
});
