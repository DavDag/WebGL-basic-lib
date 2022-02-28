/** @author: Davide Risaliti davdag24@gmail.com */

import {BasicShape} from "./types.js";
import {Vec3} from "/src/math/vec3.js";

/**
 * @class BasicShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos, 2D-TexCoord }
 * - elements array of { indices }
 */
export class Icosahedron {
  /**
   * Creates an instance of an Icosahedron with a user-defined
   * precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {BasicShape} the generated icosahedron
   */
  static asBasicShape(precision) {
    var verteces = [];
    var elements = [];

    // Create the 12 verteces icosahedron

    const X = 0.525731112119133606;
    const Z = 0.850650808352039932;
    const N = 0.0;
    
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

    elements.push(new Vec3(  0,  4,  1));
    elements.push(new Vec3(  0,  9,  4));
    elements.push(new Vec3(  9,  5,  4));
    elements.push(new Vec3(  4,  5,  8));
    elements.push(new Vec3(  4,  8,  1));
    
    elements.push(new Vec3(  8, 10,  1));
    elements.push(new Vec3(  8,  3, 10));
    elements.push(new Vec3(  5,  3,  8));
    elements.push(new Vec3(  5,  2,  3));
    elements.push(new Vec3(  2,  7,  3));
    
    elements.push(new Vec3(  7, 10,  3));
    elements.push(new Vec3(  7,  6, 10));
    elements.push(new Vec3(  7, 11,  6));
    elements.push(new Vec3( 11,  0,  6));
    elements.push(new Vec3(  0,  1,  6));
    
    elements.push(new Vec3(  6,  1, 10));
    elements.push(new Vec3(  9,  0, 11));
    elements.push(new Vec3(  9, 11,  2));
    elements.push(new Vec3(  9,  2,  5));
    elements.push(new Vec3(  7,  2, 11));

    function middle(a, b) {
      const point1 = verteces[a];
      const point2 = verteces[b];
      const point3 = Vec3.Zeros().add(point1).add(point2).normalize();
      verteces.push(point3);
      return verteces.length - 1;
    };

    // Refine the triangles
    for (let i = 0; i < precision; ++i) {
      const result = [];
      elements.forEach((face) => {
        // Refine triangle by replacing it 4 4 triangles
        const a = middle(face.x, face.y);
        const b = middle(face.y, face.z);
        const c = middle(face.z, face.x);
        result.push(new Vec3(face.x, a, c));
        result.push(new Vec3(face.y, b, a));
        result.push(new Vec3(face.z, c, b));
        result.push(new Vec3(     a, b, c));
      });
      elements = result;
    }

    verteces = verteces.flatMap((vert) => {
      const u = 0.5 + Math.atan2(vert.x, vert.z) / (2 * Math.PI);
      const v = 0.5 - Math.asin(vert.y) / Math.PI;
      return [...vert.values, u, v];
    }).flat();

    elements = elements.map((v) => [...v.values]).flat();

    return new BasicShape(verteces, elements);
  }
}