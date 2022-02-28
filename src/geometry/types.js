/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class BasicShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos, 2D-TexCoord }
 * - elements array of { indices }
 */
export class BasicShape {
  verteces;
  elements;
  
  /**
   * Creates an instance of a Mat2.
   *
   * @param {list of number} verteces the verteces list
   * @param {list of number} elements the elements list
   */
  constructor(verteces, elements) {
    this.verteces = new Float32Array(verteces);
    this.elements = new Uint16Array(elements);
  }
}