/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles} from "/src/webgl/utils.js";
import {BasicShape, TexturedShape, DebugShape} from "./types.js";
import {Vec2} from "/src/math/vec2.js";
import {Vec3} from "/src/math/vec3.js";

/**
 * @class Icosahedron representing an Icosahedron.
 */
export class Icosahedron {
  /**
   * Creates a BasicShape of an Icosahedron with a user-defined precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {BasicShape} the generated icosahedron
   */
  static asBasicShape(precision) {
    const { verteces, uvs, triangles } = Icosahedron.#buildIcosahedron(precision);
    return new BasicShape(verteces, triangles);
  }
  
  /**
   * Creates a TexturedShape of an Icosahedron with a user-defined precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {TexturedShape} the generated icosahedron
   */
  static asTexturedShape(precision) {
    const { verteces, uvs, triangles } = Icosahedron.#buildIcosahedron(precision);
    return new TexturedShape(verteces, uvs, triangles);
  }
  
  /**
   * Creates a DebugShape of an Icosahedron with a user-defined precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {DebugShape} the generated icosahedron
   */
  static asDebugShape(precision) {
    const { verteces, uvs, normals, triangles, lines } = Icosahedron.#buildIcosahedron(precision);
    return new DebugShape(verteces, uvs, normals, triangles, lines);
  }

  static #buildIcosahedron(precision) {
    precision = Math.max(0, precision);
    
    const verteces = [];
    var uvs = [];
    var normals = [];
    var triangles = [];
    var lines = [];

    // Magic values
    const X = 0.525731112119133606;
    const Z = 0.850650808352039932;
    const N = 0.0;

    // Build the 12-verteces base icosahedron
    verteces.push(new Vec3(-X, N, Z));
    verteces.push(new Vec3( X, N, Z));
    verteces.push(new Vec3(-X, N,-Z));
    verteces.push(new Vec3( X, N,-Z));
    
    verteces.push(new Vec3( N, Z, X));
    verteces.push(new Vec3( N, Z,-X));
    verteces.push(new Vec3( N,-Z, X));
    verteces.push(new Vec3( N,-Z,-X));
    
    verteces.push(new Vec3( Z, X, N));
    verteces.push(new Vec3(-Z, X, N));
    verteces.push(new Vec3( Z,-X, N));
    verteces.push(new Vec3(-Z,-X, N));
    
    triangles.push(new Vec3(  0,  4,  1));
    triangles.push(new Vec3(  0,  9,  4));
    triangles.push(new Vec3(  9,  5,  4));
    triangles.push(new Vec3(  4,  5,  8));
    triangles.push(new Vec3(  4,  8,  1));
    
    triangles.push(new Vec3(  8, 10,  1));
    triangles.push(new Vec3(  8,  3, 10));
    triangles.push(new Vec3(  5,  3,  8));
    triangles.push(new Vec3(  5,  2,  3));
    triangles.push(new Vec3(  2,  7,  3));
    
    triangles.push(new Vec3(  7, 10,  3));
    triangles.push(new Vec3(  7,  6, 10));
    triangles.push(new Vec3(  7, 11,  6));
    triangles.push(new Vec3( 11,  0,  6));
    triangles.push(new Vec3(  0,  1,  6));
    
    triangles.push(new Vec3(  6,  1, 10));
    triangles.push(new Vec3(  9,  0, 11));
    triangles.push(new Vec3(  9, 11,  2));
    triangles.push(new Vec3(  9,  2,  5));
    triangles.push(new Vec3(  7,  2, 11));

    // Method to create a middle point between two others
    const cache1 = {};
    function middle(a, b) {
      // Compute key
      const key = Math.max(a, b) + "_" + Math.min(a, b);

      // Check if already calculated
      if (!cache1[key]) {
        
        // Retrieve the two vectors from indeces
        const [vecA, vecB] = [verteces[a], verteces[b]];
  
        // Create a new vec (middle)
        const newVec = Vec3.Zeros().add(vecA).add(vecB).normalize();
  
        // Save result in cache
        cache1[key] = verteces.push(newVec) - 1;
      }

      // Return the newly created vec index
      return cache1[key];
    };

    // Iterate several times
    for (let i = 0; i < precision; ++i) {

      // Temporary array
      const result = [];

      // Iterate over each triangle to split it in four new ones
      triangles.forEach((face) => {

        // Indexes
        const a = middle(face.x, face.y);
        const b = middle(face.y, face.z);
        const c = middle(face.z, face.x);
        
        // Push new triangles
        result.push(new Vec3(face.x, a, c));
        result.push(new Vec3(face.y, b, a));
        result.push(new Vec3(face.z, c, b));
        result.push(new Vec3(     a, b, c));
      });

      // Update triangles
      triangles = result;
    }

    // Lines
    lines = LinesFromTriangles(verteces, triangles);

    // Create normals for each vertex
    normals = verteces.map((v) => v.clone().normalize());
    
    // Create uvs for each vertex
    uvs = verteces.map((v) => v.toUVofSphere());

    return { verteces, uvs, normals, triangles, lines };
  }
}