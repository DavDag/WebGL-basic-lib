/** @author: Davide Risaliti davdag24@gmail.com */

import {BasicShape, TexturedShape} from "./types.js";
import {Vec2} from "/src/math/vec2.js";
import {Vec3} from "/src/math/vec3.js";

/**
 * @class Sphere representing an Sphere.
 */
export class Sphere {
  /**
   * Creates a BasicShape of an Sphere with a user-defined precision.
   *
   * @param {number} precisionx the num of vertical slices
   * @param {number} precisiony the num of horizontal slices
   *
   * @return {BasicShape} the generated sphere
   */
  static asBasicShape(precisionx, precisiony) {
    const { verteces, uvs, triangles } = Sphere.#buildSphere(precisionx, precisiony);
    return new BasicShape(verteces, triangles);
  }
  
  /**
   * Creates a TexturedShape of a Sphere with a user-defined precision.
   *
   * @param {number} precisionx the num of vertical slices
   * @param {number} precisiony the num of horizontal slices
   *
   * @return {TexturedShape} the generated sphere
   */
  static asTexturedShape(precisionx, precisiony) {
    const { verteces, uvs, triangles } = Sphere.#buildSphere(precisionx, precisiony);
    return new TexturedShape(verteces, uvs, triangles);
  }

  static #buildSphere(precisionx, precisiony) {
    precisionx = Math.max(3, precisionx - 1);
    precisiony = Math.max(3, precisiony - 1);
    const num_vert_slices = precisionx;
    const num_hori_slices = precisiony;
    
    const verteces = [];
    const normals = [];
    const uvs = [];
    const triangles = [];
    const lines = [];

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

        // Push new vertex with position, normal and uv
        verteces.push(new Vec3(vx, vy, vz));
        normals.push(new Vec3(vx, vy, vz));
        uvs.push(new Vec2(u, v));        
      }
    }

    const L = (num_hori_slices + 1);

    // Iterate over each vertical slice
    for(let x = 0; x < num_vert_slices; ++x) {
      // Iterate over each horizontal slice
      for(let y = 0; y <= num_hori_slices; ++y) {
        // Compute offset
        const beg = x * L;
        // Triangles
        if (x != num_vert_slices - 1) {
          triangles.push(new Vec3(
                        beg + y,
                        beg + y + L,
                        beg + (y + 1) % L + L
          ));
        }        
        if (x != 0) {
          triangles.push(new Vec3(
                        beg + y,
                        beg + y + 1,
                        beg + (y + 1) % L + L
          ));
        }
        // Lines
      }
    }

    return { verteces, normals, uvs, triangles, lines };
  }
}