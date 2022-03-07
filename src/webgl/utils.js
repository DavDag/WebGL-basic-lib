/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec2} from "/src/math/vec2.js";

/*
 * Retrieve OpenGL ES context.
 * 
 * @params {string} elementId the id of the canvas element to use
 *
 * @throws an Error when the Context cannot be retrieved
 * 
 * @return {WebGLRenderingContext} the retrieved context
 */
export function RetrieveWebGLContext(elementId) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Check for errors
  if (canvas == null) throw new Error("Invalid element id");

  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Check for errors
  if (gl == null) throw new Error("WebGL is not supported");

  // Insert canvas ref into gl context
  gl.canvasEl = canvas;

  // Result
  return gl;
}

/*
 * Retrieve a lines array of indexes from triangles list and verteces.
 * 
 * @params {list of Vec3} verteces the list of verteces
 * @params {list of Vec3} triangles the list of triangles
 * 
 * @return {list of Vec2} the lines
 */
export function LinesFromTriangles(verteces, triangles) {
  const lines = [];
  const cache2 = new Set();

  triangles.forEach((face) => {
    // Add lines
    [[face.x, face.y], [face.y, face.z], [face.z, face.x]].forEach(([a, b]) => {
      // Compute key
      const vecA = verteces[a];
      const vecB = verteces[b];
      const key = Math.max(a, b) + "_" + Math.min(a, b);
      
      // Check if line is in cache
      if (!cache2.has(key)) {
        lines.push(new Vec2(a, b));
        cache2.add(key);
      }
    });
  });

  return lines;
}