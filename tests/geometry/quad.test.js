/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Quad} from "lib/all.js";

test("Quad BasicShape", () => {
  const quad = Quad.asBasicShape();
  expect(quad.name).toBe("Quad");
  expect(quad).toHaveProperty("vertexes");
  expect(quad).toHaveProperty("numVertexes");
  expect(quad).toHaveProperty("triangles");
  expect(quad).toHaveProperty("numTriangles");
  expect(quad).not.toHaveProperty("lines");
  expect(quad).not.toHaveProperty("numLines");
});

test("Quad TexturedShape", () => {
  const quad = Quad.asTexturedShape();
  expect(quad.name).toBe("Quad");
  expect(quad).toHaveProperty("vertexes");
  expect(quad).toHaveProperty("numVertexes");
  expect(quad).toHaveProperty("triangles");
  expect(quad).toHaveProperty("numTriangles");
  expect(quad).not.toHaveProperty("lines");
  expect(quad).not.toHaveProperty("numLines");
});

test("Quad AdvancedShape", () => {
  const quad = Quad.asAdvancedShape();
  expect(quad.name).toBe("Quad");
  expect(quad).toHaveProperty("vertexes");
  expect(quad).toHaveProperty("numVertexes");
  expect(quad).toHaveProperty("triangles");
  expect(quad).toHaveProperty("numTriangles");
  expect(quad).not.toHaveProperty("lines");
  expect(quad).not.toHaveProperty("numLines");
});

test("Quad RealisticShape", () => {
  const quad = Quad.asRealisticShape();
  expect(quad.name).toBe("Quad");
  expect(quad).toHaveProperty("vertexes");
  expect(quad).toHaveProperty("numVertexes");
  expect(quad).toHaveProperty("triangles");
  expect(quad).toHaveProperty("numTriangles");
  expect(quad).not.toHaveProperty("lines");
  expect(quad).not.toHaveProperty("numLines");
});

test("Quad DebugShape", () => {
  const quad = Quad.asDebugShape();
  expect(quad.name).toBe("Quad");
  expect(quad).toHaveProperty("vertexes");
  expect(quad).toHaveProperty("numVertexes");
  expect(quad).toHaveProperty("triangles");
  expect(quad).toHaveProperty("numTriangles");
  expect(quad).toHaveProperty("lines");
  expect(quad).toHaveProperty("numLines");
});
