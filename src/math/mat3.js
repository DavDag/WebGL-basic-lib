/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat} from "./mat.js";
import {Vec3} from "./vec3.js";

/**
 * @class Mat representing a 3x3 matrix.
 */
export class Mat3 extends Mat {
  /**
   * Creates an instance of a Mat3.
   *
   * @param {number, number, number} the first row
   * @param {number, number, number} the second row
   * @param {number, number, number} the third row
   */
  constructor(x_r1, y_r1, z_r1,
              x_r2, y_r2, z_r2,
              x_r3, y_r3, z_r3,) {
    super([x_r1, y_r1, z_r1,
           x_r2, y_r2, z_r2,
           x_r3, y_r3, z_r3]);
  }

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  static count() {
    return 9;
  }

  /**
   * Getter to retrieve side count.
   * 
   * @return {number} the num of elements on the side of the matrix
   */
  static side() {
    return 3;
  }

  /**
   * Syntactic-sugar for a Mat3 initialization with an array.
   *
   * @return {Mat3} the newly created vector
   */
  static FromArray(arr) {
    return new Mat3(arr[0], arr[1], arr[2],
                    arr[3], arr[4], arr[5],
                    arr[6], arr[7], arr[8]);
  }

  /**
   * Retrieve a row from the Mat3 as a Vec3.
   *
   * @param {number} index the index of the row
   *
   * @return {Vec3} the selected row
   */
  row(index) {
    return new Vec3(this.values[index * 3 + 0],
                    this.values[index * 3 + 1],
                    this.values[index * 3 + 2]);
  }

  /**
   * Retrieve a col from the Mat3 as a Vec3.
   *
   * @param {number} index the index of the column
   *
   * @return {Vec3} the selected column
   */
  col(index) {
    return new Vec3(this.values[0 + index],
                    this.values[3 + index],
                    this.values[6 + index]);
  }

  /**
   * Apply the transformation to the Mat3.
   * Operations can be concatenated.
   *
   * @param {Mat3} mat the matrix to apply
   *
   * @return {Mat3} this
   */
  apply(mat) {
    
    return this;
  }

  /**
   * Apply the translation to the Mat3.
   * Operations can be concatenated.
   *
   * @param {Vec2} vec the translation to apply
   *
   * @return {Mat3} this
   */
  translate(vec) {
    
    return this;
  }

  /**
   * Apply the scale to the Mat3.
   * Operations can be concatenated.
   *
   * @param {Vec2} vec the scale to apply
   *
   * @return {Mat3} this
   */
  scale(vec) {
    
    return this;
  }

  /**
   * Apply the rotation to the Mat3.
   * Operations can be concatenated.
   *
   * @param {number} ang the angle to rotate (in radians)
   *
   * @return {Mat3} this
   */
  rotate(ang) {
    
    return this;
  }

  /**
   * Compute the determinant of the Mat3.
   *
   * @return {number} the determinant
   */
  det() {

    return v31 * tmp6 - v30 * tmp7 + v33 * tmp8 - v32 * tmp9;
  }

  /**
   * Compute the inverse of the Mat3.
   * Operations can be concatenated.
   *
   * @throws Error when det() is 0
   *
   * @return {Mat3} this
   */
  inverse() {

    return this;
  }
}