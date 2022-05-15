/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles, Vec2, Vec3} from "../all.js";
import {Generable} from "./types.js";

/**
 * @class Quad representing an Quad.
 */
export class Quad extends Generable {

  /**
   * Protected method to actually build the cube.
   * 
   * @returns {vertexes, uvs, normals, tangents, triangles, lines}
   */
  static _build() {
    const side = 1.0;
    const sideHalf = side / 2;

    const vertexes = [
      new Vec3(-sideHalf,  sideHalf, 0),
      new Vec3(-sideHalf, -sideHalf, 0),
      new Vec3( sideHalf, -sideHalf, 0),
      new Vec3( sideHalf,  sideHalf, 0),
    ];

    const uvs = [
      new Vec2(0, 0),
      new Vec2(0, 1),
      new Vec2(1, 1),
      new Vec2(1, 0),
    ];

    const normals = [
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
    ];

    const tangents = [
      new Vec3(1, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(1, 0, 0),
    ];

    const triangles = [
      new Vec3(0, 1, 2),
      new Vec3(0, 2, 3),
    ];

    const lines = LinesFromTriangles(vertexes, triangles);

    return { vertexes, uvs, normals, tangents, triangles, lines };
  }
}