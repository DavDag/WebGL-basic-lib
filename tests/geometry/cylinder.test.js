/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Cylinder} from "lib/all.js";

const N = 8;

test("Cylinder BasicShape", () => {
  const cylinder = Cylinder.asBasicShape(N, N);
  expect(cylinder.name).toBe("Cylinder");
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder TexturedShape", () => {
  const cylinder = Cylinder.asTexturedShape(N, N);
  expect(cylinder.name).toBe("Cylinder");
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder AdvancedShape", () => {
  const cylinder = Cylinder.asAdvancedShape(N, N);
  expect(cylinder.name).toBe("Cylinder");
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder RealisticShape", () => {
  const cylinder = Cylinder.asRealisticShape(N, N);
  expect(cylinder.name).toBe("Cylinder");
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).not.toHaveProperty("lines");
  expect(cylinder).not.toHaveProperty("numLines");
});

test("Cylinder DebugShape", () => {
  const cylinder = Cylinder.asDebugShape(N, N);
  expect(cylinder.name).toBe("Cylinder");
  expect(cylinder).toHaveProperty("vertexes");
  expect(cylinder).toHaveProperty("numVertexes");
  expect(cylinder).toHaveProperty("triangles");
  expect(cylinder).toHaveProperty("numTriangles");
  expect(cylinder).toHaveProperty("lines");
  expect(cylinder).toHaveProperty("numLines");
});
