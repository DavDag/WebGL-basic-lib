
import {expect, test} from '@jest/globals';
import {Mat3, Vec3} from "../all";

test("Vec3 Count", () => {
    expect(Vec3.count()).toBe(3);
});

test("Vec3 Constructor", () => {
    expect(global.CmpVecToArr(new Vec3(1, 2, 3), [1, 2, 3])).toBe(true);
});

test("Vec3 Zeros", () => {
    expect(global.CmpVecToArr(Vec3.Zeros(), new Array(3).fill(0))).toBe(true);
});

test("Vec3 Ones", () => {
    expect(global.CmpVecToArr(Vec3.Ones(), new Array(3).fill(1))).toBe(true);
});

test("Vec3 All", () => {
    expect(global.CmpVecToArr(Vec3.All(2.534), new Array(3).fill(2.534))).toBe(true);
});

test("Vec3 FromArray", () => {
    expect(global.CmpVecToArr(Vec3.FromArray([1, 2, 3]), [1, 2, 3])).toBe(true);
});

test("Vec3 Getter", () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.x).toBeCloseTo(1);
    expect(vec.y).toBeCloseTo(2);
    expect(vec.z).toBeCloseTo(3);
    expect(vec.r).toBeCloseTo(1);
    expect(vec.g).toBeCloseTo(2);
    expect(vec.b).toBeCloseTo(3);
});

test("Vec3 Setter", () => {
    const vec = new Vec3(1, 2, 3);
    vec.x = 2;
    vec.y += 2;
    vec.z += 3;
    expect(global.CmpVecToArr(vec, [2, 4, 6])).toBe(true);
    vec.r = 3;
    vec.g += 2;
    vec.b += 3;
    expect(global.CmpVecToArr(vec, [3, 6, 9])).toBe(true);
});

test("Vec3 ToString", () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.toString(0)).toBe("[1,2,3]");
    expect(vec.toString(1)).toBe("[1.0,2.0,3.0]");
    expect(vec.toString(2)).toBe("[1.00,2.00,3.00]");
    expect(vec.toString()).toBe(vec.toString(20));
});

test("Vec3 Add", () => {
    const a = Vec3.Zeros();
    const b = Vec3.Zeros();
    const c = Vec3.Zeros();
    const o = new Vec3(1, 2, 3);
    expect(global.CmpVecToArr(a.add(o), [1, 2, 3])).toBe(true);
    expect(global.CmpVecToArr(b.add(o).add(o), [2, 4, 6])).toBe(true);
    c.add(o);
    expect(global.CmpVecToArr(c, [1, 2, 3])).toBe(true);
});

test("Vec3 Sub", () => {
    const a = Vec3.Zeros();
    const b = Vec3.Zeros();
    const c = Vec3.Zeros();
    const o = new Vec3(1, 2, 3);
    expect(global.CmpVecToArr(a.sub(o), [-1, -2, -3])).toBe(true);
    expect(global.CmpVecToArr(b.sub(o).sub(o), [-2, -4, -6])).toBe(true);
    c.sub(o);
    expect(global.CmpVecToArr(c, [-1, -2, -3])).toBe(true);
});

test("Vec3 Mul", () => {
    const a = Vec3.Ones();
    const b = Vec3.Ones();
    const c = new Vec3(1, 2, 3);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.mul(f), [f, f, f])).toBe(true);
    expect(global.CmpVecToArr(b.mul(f).mul(f), [f * f, f * f, f * f])).toBe(true);
    c.mul(f);
    expect(global.CmpVecToArr(c, [f, 2 * f, 3 * f])).toBe(true);
});

test("Vec3 Div", () => {
    const a = Vec3.Ones();
    const b = Vec3.Ones();
    const c = new Vec3(1, 2, 3);
    const f = 1.2345;
    expect(global.CmpVecToArr(a.div(f), [1 / f, 1 / f, 1 / f])).toBe(true);
    expect(global.CmpVecToArr(b.div(f).div(f), [1 / f / f, 1 / f / f, 1 / f / f])).toBe(true);
    c.div(f);
    expect(global.CmpVecToArr(c, [1 / f, 2 / f, 3 / f])).toBe(true);
});

test("Vec3 Dot", () => {
    const a = Vec3.Zeros();
    const b = Vec3.Ones();
    const c = new Vec3(1, 2, 3);
    expect(a.dot(b)).toBeCloseTo(0);
    expect(a.dot(c)).toBeCloseTo(0);
    expect(b.dot(c)).toBeCloseTo(6);
    expect(c.dot(c)).toBeCloseTo(14);
});

test("Vec3 Magnitude", () => {
    const a = Vec3.Zeros();
    const b = Vec3.Ones();
    const c = new Vec3(1, 2, 3);
    expect(a.magnitude()).toBeCloseTo(0);
    expect(b.magnitude()).toBeCloseTo(Math.sqrt(3));
    expect(c.magnitude()).toBeCloseTo(Math.sqrt(14));
});

test("Vec3 MagnitudeSquared", () => {
    const a = Vec3.Zeros();
    const b = Vec3.Ones();
    const c = new Vec3(1, 2, 3);
    expect(a.magnitudeSquared()).toBeCloseTo(0);
    expect(b.magnitudeSquared()).toBeCloseTo(3);
    expect(c.magnitudeSquared()).toBeCloseTo(14);
});

test("Vec3 Clone", () => {
    const a = Vec3.Ones();
    const b = a.clone();
    b.x = 2;
    expect(global.CmpVecToArr(a, [1, 1, 1])).toBe(true);
    expect(global.CmpVecToArr(b, [2, 1, 1])).toBe(true);
});

test("Vec3 Equals", () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(1, 2, 3);
    const c = a.clone().div(4).mul(4);
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
    expect(a.equals(c)).toBe(true);
    expect(c.equals(a)).toBe(true);
    expect(a.equals(Vec3.Zeros())).toBe(false);
});

test("Vec3 Round", () => {
    const a = new Vec3(1.3456, 2.3456, 3.3456);
    expect(global.CmpVecToArr(a.clone().round(0), [1, 2, 3])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(1), [1.3, 2.3, 3.3])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(2), [1.35, 2.35, 3.35])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(3), [1.346, 2.346, 3.346])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(4), [1.3456, 2.3456, 3.3456])).toBe(true);
    expect(global.CmpVecToArr(a.clone().round(5), [1.34560, 2.34560, 3.34560])).toBe(true);
});

test("Vec3 Normalize", () => {
    const a = new Vec3(1, 0, 0).normalize();
    const b = new Vec3(1, 2, 3).normalize().round(2);
    expect(global.CmpVecToArr(a, [1, 0, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [0.27, 0.53, 0.80])).toBe(true);
});

test("Vec3 Inverse", () => {
    const a = new Vec3(1, 0, 0).inverse();
    const b = new Vec3(1, 2, 3).inverse().round(2);
    expect(global.CmpVecToArr(a, [1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY])).toBe(true);
    expect(global.CmpVecToArr(b, [1, 0.5, 0.33])).toBe(true);
});

test("Vec3 Negate", () => {
    const a = new Vec3(1, 0, 0).negate();
    const b = new Vec3(1, 2, 3).negate();
    expect(global.CmpVecToArr(a, [-1, 0, 0])).toBe(true);
    expect(global.CmpVecToArr(b, [-1, -2, -3])).toBe(true);
});

test("Vec3 Transform", () => {
    const a = new Vec3(1, 2, 3);
    const m = new Mat3(0, 1, 2, 3, 4, 5, 6, 7, 8);
    a.transform(m);
    expect(global.CmpVecToArr(a, [8, 26, 44])).toBe(true);
});

test("Vec3 to Vec4", () => {
    const a = new Vec3(1, 2, 3);
    const b = a.toVec4(4);
    expect(global.CmpVecToArr(b, [1, 2, 3, 4])).toBe(true);
});

test("Vec3 to Vec2", () => {
    const a = new Vec3(1, 2, 3);
    const b = a.toVec2();
    expect(global.CmpVecToArr(b, [1, 2])).toBe(true);
});

test("Vec3 Cross", () => {
    const a = new Vec3(2, 3, 4);
    const b = new Vec3(5, 6, 7);
    const c = new Vec3(0, 1, 0);
    const d = new Vec3(1, 0, 0);
    expect(global.CmpVecToArr(a.clone().cross(b), [-3, 6, -3])).toBe(true);
    expect(global.CmpVecToArr(b.clone().cross(a), [3, -6, 3])).toBe(true);
    expect(global.CmpVecToArr(c.clone().cross(d), [0, 0, -1])).toBe(true);
    expect(global.CmpVecToArr(d.clone().cross(c), [0, 0, 1])).toBe(true);
});
