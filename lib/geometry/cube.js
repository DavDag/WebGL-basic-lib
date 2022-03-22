/** @author: Davide Risaliti davdag24@gmail.com */

import {LinesFromTriangles, Vec2, Vec3} from "../all.js";
import {Generable} from "./types.js";

/**
 * @class Cube representing an Cube.
 */
export class Cube extends Generable {

  /**
   * Protected method to actually build the cube.
   *
   * @param {number} size the side length of the cube
   * 
   * @returns {verteces, uvs, normals, triangles, lines}
   */
  static _build(side) {
    const verteces = [];
    const uvs = [];
    const normals = [];
    const triangles = [];
    var lines = [];

    const F = new Vec3( 0,  0,  1);
    const B = new Vec3( 0,  0, -1);
    const L = new Vec3(-1,  0,  0);
    const R = new Vec3( 1,  0,  0);
    const T = new Vec3( 0, -1,  0);
    const D = new Vec3( 0,  1,  0);
    
    normals.push(
      F, F, F, F, // Front (if camera is facing towards -Z)
      B, B, B, B, // Back
      L, L, L, L, // Left
      R, R, R, R, // Right
      T, T, T, T, // Top
      D, D, D, D, // Down
    );

    const fTL = () => new Vec3(-1,  1,  1);
    const fTR = () => new Vec3( 1,  1,  1);
    const fBL = () => new Vec3(-1, -1,  1);
    const fBR = () => new Vec3( 1, -1,  1);
    const bTL = () => new Vec3(-1,  1, -1);
    const bTR = () => new Vec3( 1,  1, -1);
    const bBL = () => new Vec3(-1, -1, -1);
    const bBR = () => new Vec3( 1, -1, -1);

    verteces.push(
      fTL(), fBL(), fTR(), fBR(), // Front (if camera is facing towards -Z)
      bTR(), bBR(), bTL(), bBL(), // Back
      bTL(), bBL(), fTL(), fBL(), // Left
      fTR(), fBR(), bTR(), bBR(), // Right      
      fTL(), fTR(), bTL(), bTR(), // Top      
      fBL(), fBR(), bBL(), bBR(), // Down
    );
    verteces.forEach((v) => v.mul(side / 2.0));

    // TODO
    uvs.push(...new Array(24).fill(Vec2.Zeros()));

    triangles.push(
      new Vec3( 0,  1,  2), new Vec3( 1,  2,  3),
      new Vec3( 4,  5,  6), new Vec3( 5,  6,  7),
      new Vec3( 8,  9, 10), new Vec3( 9, 10, 11),
      new Vec3(12, 13, 14), new Vec3(13, 14, 15),
      new Vec3(16, 17, 18), new Vec3(17, 18, 19),
      new Vec3(20, 21, 22), new Vec3(21, 22, 23),
    );

    // Lines
    lines = LinesFromTriangles(verteces, triangles);

    return { verteces, uvs, normals, triangles, lines };
  }
}