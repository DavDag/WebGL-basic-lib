/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec2} from "../all.js";

/*
 * Retrieve a lines array of indexes from triangles list and vertexes.
 * 
 * @params {list of Vec3} vertexes the list of vertexes
 * @params {list of Vec3} triangles the list of triangles
 * 
 * @return {list of Vec2} the lines
 */
export function LinesFromTriangles(vertexes, triangles) {
  const lines = [];
  const cache2 = new Set();

  triangles.forEach((face) => {
    // Add lines
    [[face.x, face.y], [face.y, face.z], [face.z, face.x]].forEach(([a, b]) => {
      // Compute key
      const vecA = vertexes[a];
      const vecB = vertexes[b];
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