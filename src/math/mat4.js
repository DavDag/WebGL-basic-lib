/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat} from "./mat.js";

/**
 * @class Mat representing a 4x4 matrix.
 */
export class Mat4 extends Mat {
  /**
   * Creates an instance of a Mat4.
   *
   * @param {number, number, number, number} the first row
   * @param {number, number, number, number} the second row
   * @param {number, number, number, number} the third row
   * @param {number, number, number, number} the fourth row
   */
  constructor(x_r1, y_r1, z_r1, w_r1,
              x_r2, y_r2, z_r2, w_r2,
              x_r3, y_r3, z_r3, w_r3,
              x_r4, y_r4, z_r4, w_r4) {
    super([x_r1, y_r1, z_r1, w_r1,
           x_r2, y_r2, z_r2, w_r2,
           x_r3, y_r3, z_r3, w_r3,
           x_r4, y_r4, z_r4, w_r4]);
  }
}