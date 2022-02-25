/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Mat base vector class.
 */
export class Mat {
  values;

  /**
   * Creates an instance of a Mat.
   *
   * @param {array of number} arr the array of values
   */
  constructor(arr) {
    this.values = new Float32Array(arr);
  }
}