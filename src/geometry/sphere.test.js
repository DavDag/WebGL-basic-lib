/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Sphere} from "../all";

test("Sphere BasicShape", () => {
  const N = 3;
  const sphere = Sphere.asBasicShape(N, N);
  expect(sphere).toHaveProperty("verteces");
  expect(sphere).toHaveProperty("numVerteces");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere TexturedShape", () => {
  const N = 4;
  const sphere = Sphere.asTexturedShape(N, N);
  expect(sphere).toHaveProperty("verteces");
  expect(sphere).toHaveProperty("numVerteces");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere DebugShape", () => {
  const N = 5;
  const sphere = Sphere.asDebugShape(N, N);
  expect(sphere).toHaveProperty("verteces");
  expect(sphere).toHaveProperty("numVerteces");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).toHaveProperty("lines");
  expect(sphere).toHaveProperty("numLines");
});
