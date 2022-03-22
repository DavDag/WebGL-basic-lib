/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Cube} from "lib/all.js";

test("Cube BasicShape", () => {
  const N = 1;
  const cube = Cube.asBasicShape(N);
  expect(cube).toHaveProperty("verteces");
  expect(cube).toHaveProperty("numVerteces");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).not.toHaveProperty("lines");
  expect(cube).not.toHaveProperty("numLines");
});

test("Cube TexturedShape", () => {
  const N = 5;
  const cube = Cube.asTexturedShape(N);
  expect(cube).toHaveProperty("verteces");
  expect(cube).toHaveProperty("numVerteces");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).not.toHaveProperty("lines");
  expect(cube).not.toHaveProperty("numLines");
});

test("Cube DebugShape", () => {
  const N = 10;
  const cube = Cube.asDebugShape(N);
  expect(cube).toHaveProperty("verteces");
  expect(cube).toHaveProperty("numVerteces");
  expect(cube).toHaveProperty("triangles");
  expect(cube).toHaveProperty("numTriangles");
  expect(cube).toHaveProperty("lines");
  expect(cube).toHaveProperty("numLines");
});
