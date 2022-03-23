/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Icosahedron} from "lib/all.js";

test("Icosahedron BasicShape", () => {
  const N = 0;
  const icosahedron = Icosahedron.asBasicShape(N, N);
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron TexturedShape", () => {
  const N = 1;
  const icosahedron = Icosahedron.asTexturedShape(N, N);
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).not.toHaveProperty("lines");
  expect(icosahedron).not.toHaveProperty("numLines");
});

test("Icosahedron DebugShape", () => {
  const N = 2;
  const icosahedron = Icosahedron.asDebugShape(N, N);
  expect(icosahedron).toHaveProperty("vertexes");
  expect(icosahedron).toHaveProperty("numVertexes");
  expect(icosahedron).toHaveProperty("triangles");
  expect(icosahedron).toHaveProperty("numTriangles");
  expect(icosahedron).toHaveProperty("lines");
  expect(icosahedron).toHaveProperty("numLines");
});
