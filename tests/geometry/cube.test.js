/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Cube} from "lib/all.js";

test("Cube BasicShape", () => {
  const cube = Cube.asBasicShape();
  expect(cube).toHaveProperty("vertexes");
  expect(cube).toHaveProperty("numVertexes");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).not.toHaveProperty("lines");
  expect(cube).not.toHaveProperty("numLines");
});

test("Cube TexturedShape", () => {
  const cube = Cube.asTexturedShape();
  expect(cube).toHaveProperty("vertexes");
  expect(cube).toHaveProperty("numVertexes");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).not.toHaveProperty("lines");
  expect(cube).not.toHaveProperty("numLines");
});

test("Cube AdvancedShape", () => {
  const cube = Cube.asAdvancedShape();
  expect(cube).toHaveProperty("vertexes");
  expect(cube).toHaveProperty("numVertexes");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).not.toHaveProperty("lines");
  expect(cube).not.toHaveProperty("numLines");
});

test("Cube DebugShape", () => {
  const cube = Cube.asDebugShape();
  expect(cube).toHaveProperty("vertexes");
  expect(cube).toHaveProperty("numVertexes");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).toHaveProperty("lines");
  expect(cube).toHaveProperty("numLines");
});
