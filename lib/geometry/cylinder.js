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
   * @returns {vertexes, uvs, normals, triangles, lines}
   */
   static _build(precision) {
    precision = Math.max(precision, 5);

    const vertexes = [];
    const uvs = [];
    const normals = [];
    const triangles = [];
    var lines = [];

    const step = toRad(360 / (precision - 1));
    for (let i = 0; i < precision; ++i) {
      const angle = i * step;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      vertexes.push(new Vec3(  0, +0.5,   0));
      vertexes.push(new Vec3(cos, +0.5, sin));
      vertexes.push(new Vec3(cos, -0.5, sin));
      vertexes.push(new Vec3(  0, -0.5,   0));
    }

    for (let i = 0; i < precision; ++i) {
      const b = i * 4; // Index begin for vertexes of this slice (i-th)
      const n = ((i + 1) % precision) * 4; // Index begin for vertexes of the next slice
      triangles.push(new Vec3(b + 0, b + 1, n + 1));
      triangles.push(new Vec3(b + 1, b + 2, n + 1));
      triangles.push(new Vec3(b + 2, n + 1, n + 2));
      triangles.push(new Vec3(b + 3, b + 2, n + 2));
    }

    // TODO
    uvs.push(...new Array(vertexes.length).fill(Vec2.Zeros()));
    normals.push(...new Array(vertexes.length).fill(Vec3.Zeros()));

    // Lines
    lines = LinesFromTriangles(vertexes, triangles);

    return { vertexes, uvs, normals, triangles, lines };
   }
}
