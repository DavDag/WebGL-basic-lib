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
   * @returns {vertexes, uvs, normals, tangents, triangles, lines}
   */
  static _build() {
    const side = 1.0;

    const vertexes = [];
    const uvs = [];
    const normals = [];
    const tangents = [];
    const triangles = [];
    let lines = [];

    // Declare 8 vertexes
    const fTL = () => new Vec3(-1,  1,  1);
    const fTR = () => new Vec3( 1,  1,  1);
    const fBL = () => new Vec3(-1, -1,  1);
    const fBR = () => new Vec3( 1, -1,  1);
    const bTL = () => new Vec3(-1,  1, -1);
    const bTR = () => new Vec3( 1,  1, -1);
    const bBL = () => new Vec3(-1, -1, -1);
    const bBR = () => new Vec3( 1, -1, -1);

    // Push vertexes as 24-length cube to enable per-face attributes
    vertexes.push(
      fTL(), fBL(), fTR(), fBR(), // Front
      bTR(), bBR(), bTL(), bBL(), // Back
      bTL(), bBL(), fTL(), fBL(), // Left
      fTR(), fBR(), bTR(), bBR(), // Right      
      fTL(), fTR(), bTL(), bTR(), // Top      
      fBL(), fBR(), bBL(), bBR(), // Down
    );
    vertexes.forEach((v) => v.mul(side / 2.0));

    // Declare 6-face normals
    const F = new Vec3( 0,  0,  1);
    const B = new Vec3( 0,  0, -1);
    const R = new Vec3( 1,  0,  0);
    const L = new Vec3(-1,  0,  0);
    const T = new Vec3( 0,  1,  0);
    const D = new Vec3( 0, -1,  0);
    
    // Normals
    normals.push(
      F, F, F, F, // Front
      B, B, B, B, // Back
      L, L, L, L, // Left
      R, R, R, R, // Right
      T, T, T, T, // Top
      D, D, D, D, // Down
    );

    // TODO
    uvs.push(...new Array(24).fill(Vec2.Zeros()));
    tangents.push(...new Array(24).fill(Vec3.Zeros()));

    // Create quads
    triangles.push(
      new Vec3( 0,  1,  2), new Vec3( 1,  2,  3), // Front
      new Vec3( 4,  5,  6), new Vec3( 5,  6,  7), // Back
      new Vec3( 8,  9, 10), new Vec3( 9, 10, 11), // Left
      new Vec3(12, 13, 14), new Vec3(13, 14, 15), // Right
      new Vec3(16, 17, 18), new Vec3(17, 18, 19), // Top
      new Vec3(20, 21, 22), new Vec3(21, 22, 23), // Down
    );

    // Lines
    lines = LinesFromTriangles(vertexes, triangles);

    return { vertexes, uvs, normals, tangents, triangles, lines };
  }
}