/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Cylinder} from "lib/all.js";

test("Cylinder BasicShape", () => {
  const N = 0;
  const cylinder = Cylinder.asBasicShape(N, N);
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder TexturedShape", () => {
  const N = 1;
  const cylinder = Cylinder.asTexturedShape(N, N);
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder DebugShape", () => {
  const N = 2;
  const cylinder = Cylinder.asDebugShape(N, N);
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).toHaveProperty("lines");
  expect(cylinder).toHaveProperty("numLines");
});
