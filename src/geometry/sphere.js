/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles} from "/src/webgl/utils.js";
import {BasicShape, TexturedShape, DebugShape} from "./types.js";
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
  
  /**
   * Creates a DebugShape of a Sphere with a user-defined precision.
   *
   * @param {number} precisionx the num of vertical slices
   * @param {number} precisiony the num of horizontal slices
   *
   * @return {DebugShape} the generated sphere
   */
  static asDebugShape(precisionx, precisiony) {
    const { verteces, uvs, normals, triangles, lines } = Sphere.#buildSphere(precisionx, precisiony);
    return new DebugShape(verteces, uvs, normals, triangles, lines);
  }

  static #buildSphere(precisionx, precisiony) {
    const num_vert_slices = Math.max(3, precisionx);
    const num_hori_slices = Math.max(3, precisiony);
    
    const verteces = [];
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
        verteces.push(new Vec3(vx, vy, vz));
        uvs.push(new Vec2(u, v));
        normals.push(new Vec3(vx, vy, vz));
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

    // uvs.forEach((v) => console.log(v.toString(2)));
    // verteces.forEach((v) => console.log(v.toString(3)));
    // triangles.forEach((t) => console.log(t.toString(0)));

    // Lines
    lines = LinesFromTriangles(verteces, triangles);

    return { verteces, uvs, normals, triangles, lines };
  }
}