/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles, Vec3} from "../all.js";
import {Generable} from "./types.js";

/**
 * @class Icosahedron representing an Icosahedron.
 */
export class Icosahedron extends Generable {

  /**
   * Protected method to actually build the icosahedron.
   *
   * @param {number} precision the precision to use when generating the shape
   * 
   * @returns {vertexes, uvs, normals, tangents, triangles, lines}
   */
  static _build(precision) {
    precision = Math.max(0, precision);
    
    const vertexes = [];
    let uvs = [];
    let normals = [];
    const tangents = [];
    let triangles = [];
    let lines = [];

    // Magic values
    const X = 0.525731112119133606;
    const Z = 0.850650808352039932;
    const N = 0.0;

    // Build the 12-vertexes base icosahedron
    vertexes.push(new Vec3(-X, N, Z));
    vertexes.push(new Vec3( X, N, Z));
    vertexes.push(new Vec3(-X, N,-Z));
    vertexes.push(new Vec3( X, N,-Z));
    
    vertexes.push(new Vec3( N, Z, X));
    vertexes.push(new Vec3( N, Z,-X));
    vertexes.push(new Vec3( N,-Z, X));
    vertexes.push(new Vec3( N,-Z,-X));
    
    vertexes.push(new Vec3( Z, X, N));
    vertexes.push(new Vec3(-Z, X, N));
    vertexes.push(new Vec3( Z,-X, N));
    vertexes.push(new Vec3(-Z,-X, N));
    
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
        const [vecA, vecB] = [vertexes[a], vertexes[b]];
  
        // Create a new vec (middle)
        const newVec = Vec3.Zeros().add(vecA).add(vecB).normalize();
  
        // Save result in cache
        cache1[key] = vertexes.push(newVec) - 1;
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
    lines = LinesFromTriangles(vertexes, triangles);
    tangents.push(...new Array(vertexes.length).fill(Vec3.Zeros()));

    // Create normals for each vertex
    normals = vertexes.map((v) => v.clone().normalize());
    
    // Create uvs for each vertex
    uvs = vertexes.map((v) => v.toUVofSphere());

    // To ensure diameter of 1
    vertexes.forEach((v) => v.div(2));

    return { vertexes, uvs, normals, tangents, triangles, lines };
  }
}