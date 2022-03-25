/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Icosahedron} from "lib/all.js";

const N = 2;

test("Icosahedron BasicShape", () => {
  const icosahedron = Icosahedron.asBasicShape(N, N);
  expect(icosahedron.name).toBe("Icosahedron");
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron TexturedShape", () => {
  const icosahedron = Icosahedron.asTexturedShape(N, N);
  expect(icosahedron.name).toBe("Icosahedron");
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron AdvancedShape", () => {
  const icosahedron = Icosahedron.asAdvancedShape(N, N);
  expect(icosahedron.name).toBe("Icosahedron");
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron RealisticShape", () => {
  const icosahedron = Icosahedron.asRealisticShape(N, N);
  expect(icosahedron.name).toBe("Icosahedron");
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron DebugShape", () => {
  const icosahedron = Icosahedron.asDebugShape(N, N);
  expect(icosahedron.name).toBe("Icosahedron");
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).toHaveProperty("lines");
  expect(icosahedron).toHaveProperty("numLines");
});
