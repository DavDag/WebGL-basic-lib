/** @author: Davide Risaliti davdag24@gmail.com */

import {BasicShape, TexturedShape} from "./types.js";
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
    const { verteces, uvs, elements } = Icosahedron.#buildIcosahedron(precision);
    return new BasicShape(verteces, elements);
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
    const { verteces, uvs, elements } = Icosahedron.#buildIcosahedron(precision);
    return new TexturedShape(verteces, uvs, elements);
  }

  static #buildIcosahedron(precision) {
    precision = Math.max(0, precision);
    
    const verteces = [];
    var elements = [];
    var uvs = [];
    
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

    for (let i = 0; i < precision; ++i) {
      const result = [];
      elements.forEach((face) => {
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

    uvs = verteces.map((v) => v.toUVofSphere());

    return { verteces, elements, uvs };
  }
}