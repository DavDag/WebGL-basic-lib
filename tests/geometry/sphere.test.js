/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Sphere} from "lib/all.js";

const N = 5;

test("Sphere BasicShape", () => {
  const sphere = Sphere.asBasicShape(N, N);
  expect(sphere.name).toBe("Sphere");
  expect(sphere).toHaveProperty("vertexes");
  expect(sphere).toHaveProperty("numVertexes");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere TexturedShape", () => {
  const sphere = Sphere.asTexturedShape(N, N);
  expect(sphere.name).toBe("Sphere");
  expect(sphere).toHaveProperty("vertexes");
  expect(sphere).toHaveProperty("numVertexes");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere AdvancedShape", () => {
  const sphere = Sphere.asAdvancedShape(N, N);
  expect(sphere.name).toBe("Sphere");
  expect(sphere).toHaveProperty("vertexes");
  expect(sphere).toHaveProperty("numVertexes");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere RealisticShape", () => {
  const sphere = Sphere.asRealisticShape(N, N);
  expect(sphere.name).toBe("Sphere");
  expect(sphere).toHaveProperty("vertexes");
  expect(sphere).toHaveProperty("numVertexes");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).not.toHaveProperty("lines");
  expect(sphere).not.toHaveProperty("numLines");
});

test("Sphere DebugShape", () => {
  const sphere = Sphere.asDebugShape(N, N);
  expect(sphere.name).toBe("Sphere");
  expect(sphere).toHaveProperty("vertexes");
  expect(sphere).toHaveProperty("numVertexes");
  expect(sphere).toHaveProperty("triangles");
  expect(sphere).toHaveProperty("numTriangles");
  expect(sphere).toHaveProperty("lines");
  expect(sphere).toHaveProperty("numLines");
});
