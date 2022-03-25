/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles, toRad, Vec2, Vec3} from "../all.js";
import {Generable} from "./types.js";

/**
 * @class Cylinder representing an Cylinder.
 */
export class Cylinder extends Generable {
  
  /**
   * Protected method to actually build the cylinder.
   *
   * @param {number} precision the precision to use when generating the shape
   * 
   * @returns {vertexes, uvs, normals, tangents, triangles, lines}
   */
   static _build(precision) {
    precision = Math.max(precision, 5);

    const vertexes = [];
    const uvs = [];
    const normals = [];
    const tangents = [];
    const triangles = [];
    let lines = [];

    // Precision represents the num of vertical slices
    const step = toRad(360 / (precision - 1));
    for (let i = 0; i < precision; ++i) {
      // Each slice has fixed angle
      const angle = i * step;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      // Creates slice vertexes
      vertexes.push(new Vec3(  0, +1,   0)); // Top central vertex
      vertexes.push(new Vec3(cos, +1, sin)); // Top side vertex (1)
      vertexes.push(new Vec3(cos, +1, sin)); // Top side vertex (2)
      vertexes.push(new Vec3(cos, -1, sin)); // Bottom side vertex (1)
      vertexes.push(new Vec3(cos, -1, sin)); // Bottom side vertex (2)
      vertexes.push(new Vec3(  0, -1,   0)); // Bottom central vertex
      normals.push(new Vec3(0, +1, 0));
      normals.push(new Vec3(0, +1, 0));
      normals.push(new Vec3(cos, 0, sin).normalize());
      normals.push(new Vec3(cos, 0, sin).normalize());
      normals.push(new Vec3(0, -1, 0));
      normals.push(new Vec3(0, -1, 0));
    }

    // Num of vertexes per slice
    const N = 6;

    // Generates 4 triangles for each slice
    for (let i = 0; i < precision; ++i) {
      // Index begin for vertexes of this slice (i-th)
      const b = i * N;
      // Index begin for vertexes of the next slice
      const n = ((i + 1) % precision) * N;
      // Create faces
      triangles.push(new Vec3(b + 0, b + 1, n + 1)); // Top face
      triangles.push(new Vec3(b + 2, b + 3, n + 2)); // Side quad (1)
      triangles.push(new Vec3(b + 3, n + 2, n + 3)); // Side quad (2)
      triangles.push(new Vec3(b + 4, b + 5, n + 4)); // Bottom face
    }

    // TODO
    uvs.push(...new Array(vertexes.length).fill(Vec2.Zeros()));
    tangents.push(...new Array(vertexes.length).fill(Vec3.Zeros()));

    // Lines
    lines = LinesFromTriangles(vertexes, triangles);

    // To ensure height and diameter of 1
    vertexes.forEach((v) => v.div(2));

    return { vertexes, uvs, normals, tangents, triangles, lines };
   }
}
