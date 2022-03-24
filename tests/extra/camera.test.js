/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Camera, Vec3, Mat4, toRad} from "lib/all.js";

const a = [
  [[90, 1, 0.1, 100], [new Vec3(0, 0, 5), new Vec3(0, 0, -1), new Vec3(0, 1, 0)]],
  [[45, 1, 0.1, 100], [new Vec3(0, 0, 5), new Vec3(0, 0,  5), new Vec3(0, 1, 0)]],
  [[45, 1, 0.1, 100], [new Vec3(0, 0, 5), new Vec3(0, 0, -5), new Vec3(0, 1, 0)]],
  [[90, 1, 0.0, 100], [new Vec3(0, 0, 5), new Vec3(0, 0, -1), new Vec3(0, 1, 0)]],
];

const aa = a.map((data) => {
  const [[fov, ratio, near, far], [pos, dir, up]] = data;
  const perspective = Mat4.Perspective(toRad(fov), ratio, near, far);
  const lookat = Mat4.LookAt(pos, pos.clone().add(dir), up);
  return [...data, perspective, lookat];
});

test("Camera Constructor", () => {
  aa.forEach(([[fov, ratio, near, far], [pos, dir, up], perspective, lookat]) => {
    const camera = new Camera(fov, ratio, near, far, pos, dir, up);
    const expected = Mat4.Identity().apply(perspective).apply(lookat);
    expect(global.CmpMatToMat(camera.perspectiveMat, perspective)).toBe(true);
    expect(global.CmpMatToMat(camera.lookatMat, lookat)).toBe(true);
    expect(global.CmpMatToMat(camera.mat, expected)).toBe(true);
  });
});

test("Camera MovePos", () => {
  const [[fov, ratio, near, far], [pos, dir, up], perspective, lookat] = aa[0];
  const camera = new Camera(fov, ratio, near, far, pos, dir, up);
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
  camera.movePos(Vec3.Zeros());
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
});

test("Camera MoveDir", () => {
  const [[fov, ratio, near, far], [pos, dir, up], perspective, lookat] = aa[0];
  const camera = new Camera(fov, ratio, near, far, pos, dir, up);
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
  camera.moveDir(Vec3.Zeros());
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
});

test("Camera Setter", () => {
  const [[fov, ratio, near, far], [pos, dir, up], perspective, lookat] = aa[0];
  const camera = new Camera(fov, ratio, near, far, pos, dir, up);
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
  camera.ratio = 1.0;
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
  camera.position = new Vec3(0, 1, 0);
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
  camera.target = new Vec3(0, 1, 0);
  expect(camera.isDirty()).toBe(true);
  camera.update();
  expect(camera.isDirty()).toBe(false);
});
