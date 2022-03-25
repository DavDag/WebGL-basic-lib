/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat} from "./mat.js";
import {Vec2} from "../all.js";

/**
 * @class Mat representing a 2x2 matrix.
 */
export class Mat2 extends Mat {
  /**
   * Creates an instance of a Mat2.
   *
   * @param {number, number} the first row
   * @param {number, number} the second row
   */
  constructor(x_r1, y_r1,
              x_r2, y_r2) {
    super([x_r1, x_r2,
           y_r1, y_r2]);
  }

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  static count() {
    return 4;
  }

  /**
   * Getter to retrieve side count.
   * 
   * @return {number} the num of elements on the side of the matrix
   */
  static side() {
    return 2;
  }

  /**
   * Syntactic-sugar for a Mat2 initialization with an array.
   *
   * Column-Major version.
   *
   * @return {Mat2} the newly created vector
   */
  static FromArrayCM(arr) {
    return new Mat2(arr[0], arr[2],
                    arr[1], arr[3]);
  }

  /**
   * Syntactic-sugar for a Mat2 initialization with an array.
   *
   * Row-Major version.
   *
   * @return {Mat2} the newly created vector
   */
  static FromArrayRM(arr) {
    return new Mat2(arr[0], arr[1],
                    arr[2], arr[3]);
  }

  /**
   * Retrieve a row from the Mat2 as a Vec2.
   *
   * @param {number} index the index of the row
   *
   * @return {Vec2} the selected row
   */
  row(index) {
    return new Vec2(this.values[0 + index],
                    this.values[2 + index]);
  }

  /**
   * Retrieve a col from the Mat2 as a Vec2.
   *
   * @param {number} index the index of the column
   *
   * @return {Vec2} the selected column
   */
  col(index) {
    return new Vec2(this.values[index * 2 + 0],
                    this.values[index * 2 + 1]);
  }

  /**
   * Apply the transformation to the Mat2.
   * Operations can be concatenated.
   *
   * @param {Mat2} mat the matrix to apply
   *
   * @return {Mat2} this
   */
  apply(mat) {
    const v00 = this.values[0];
    const v01 = this.values[1];
    const v10 = this.values[2];
    const v11 = this.values[3];
    
    this.values[0] = v00 * mat.values[0] + v01 * mat.values[2];
    this.values[1] = v00 * mat.values[1] + v01 * mat.values[3];
    this.values[2] = v10 * mat.values[0] + v11 * mat.values[2];
    this.values[3] = v10 * mat.values[1] + v11 * mat.values[3];
    
    return this;
  }

  /**
   * Apply the scale to the Mat2.
   * Operations can be concatenated.
   *
   * @param {Vec2} vec the scale to apply
   *
   * @return {Mat2} this
   */
  scale(vec) {
    this.values[0] *= vec.x;
    this.values[1] *= vec.x;
    
    this.values[2] *= vec.y;
    this.values[3] *= vec.y;
    
    return this;
  }

  /**
   * Apply the rotation to the Mat2.
   * Operations can be concatenated.
   *
   * @param {number} ang the angle to rotate (in radians)
   *
   * @return {Mat2} this
   */
  rotate(ang) {
    const s = Math.sin(ang);
    const c = Math.cos(ang);

    const v00 = this.values[0];
    const v10 = this.values[1];
    const v01 = this.values[2];
    const v11 = this.values[3];

    this.values[0] = v00 *  c + v01 * s;
    this.values[1] = v10 *  c + v11 * s;
    this.values[2] = v00 * -s + v01 * c;
    this.values[3] = v10 * -s + v11 * c;
    
    return this;
  }

  /**
   * Compute the determinant of the Mat2.
   *
   * @return {number} the determinant
   */
  det() {
    return this.values[0] * this.values[3]
         - this.values[2] * this.values[1];
  }

  /**
   * Compute the inverse of the Mat2.
   * Operations can be concatenated.
   *
   * @throws Error when det() is 0
   *
   * @return {Mat2} this
   */
  inverse() {
    const v00 = this.values[0];
    const v10 = this.values[1];
    const v01 = this.values[2];
    const v11 = this.values[3];
    
    let det = v00 * v11 - v01 * v10;

    if (det === 0) throw new Error("Unable to inverse matrix if det is zero");
    
    det = 1.0 / det;

    this.values[0] =  v11 * det;
    this.values[1] = -v10 * det;
    this.values[2] = -v01 * det;
    this.values[3] =  v00 * det;
    
    return this;
  }
}