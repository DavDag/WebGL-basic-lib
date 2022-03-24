/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles, Vec2, Vec3} from "../all.js";
import {Generable} from "./types.js";

/**
 * @class Sphere representing an Sphere.
 */
export class Sphere extends Generable {

  /**
   * Protected method to actually build the sphere.
   *
   * @param {number} precisionx the num of vertical slices
   * @param {number} precisiony the num of horizontal slices
   * 
   * @returns {vertexes, uvs, normals, triangles, lines}
   */
  static _build(precisionx, precisiony) {
    const num_vert_slices = Math.max(3, precisionx);
    const num_hori_slices = Math.max(3, precisiony);
    
    const vertexes = [];
    const uvs = [];
    const normals = [];
    const triangles = [];
    var lines = [];

    // Iterate over each vertical slice
    for(let x = 0; x <= num_vert_slices; ++x) {

      // Iterate over each horizontal slice
      for(let y = 0; y <= num_hori_slices; ++y) {
      
        // Find the angles
        const angle0 =     Math.PI * x / num_vert_slices;
        const angle1 = 2 * Math.PI * y / num_hori_slices;

        // Retrieve coordinates from angles
        const vx = Math.sin(angle0) * Math.cos(angle1);
        const vy = Math.cos(angle0);
        const vz = Math.sin(angle0) * Math.sin(angle1);

        // Retrieve uvs from slice indexes
        const u = y / num_hori_slices;
        const v = x / num_vert_slices;

        // Push new vertex with position, uv and normal
        const vert = new Vec3(vx, vy, vz);
        vertexes.push(vert);
        uvs.push(new Vec2(u, v));
        normals.push(vert);
      }
    }

    const L = num_hori_slices + 1;

    // Iterate over each vertical slice
    for(let x = 0; x < num_vert_slices; ++x) {

      // Iterate over each horizontal slice
      for(let y = 0; y < num_hori_slices; ++y) {
        const b  = x * L;
        const c  = ((y != L - 1) ? L : 0);
        
        const i0 = b + y;
        const i1 = b + y + 1;
        const i2 = b + y + L;
        const i3 = b + (y + 1) % L;
        
        // Triangles
        if (x != num_vert_slices - 1) {
          triangles.push(new Vec3(i0, i2, i3 + L));
        }        
        if (x != 0) {
          triangles.push(new Vec3(i0, i1, i3 + L));
        }
      }
    }

    // Lines
    lines = LinesFromTriangles(vertexes, triangles);

    // To ensure diameter of 1
    vertexes.forEach((v) => v.div(2));

    return { vertexes, uvs, normals, triangles, lines };
  }
}