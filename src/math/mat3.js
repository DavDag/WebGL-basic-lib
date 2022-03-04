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
    super([x_r1, x_r2, x_r3,
           y_r1, y_r2, y_r3,
           z_r1, z_r2, z_r3]);
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
   * Column-Major version.
   *
   * @return {Mat3} the newly created vector
   */
  static FromArrayCM(arr) {
    return new Mat3(arr[0], arr[3], arr[6],
                    arr[1], arr[4], arr[7],
                    arr[2], arr[5], arr[8]);
  }

  /**
   * Syntactic-sugar for a Mat3 initialization with an array.
   *
   * Row-Major version.
   *
   * @return {Mat3} the newly created vector
   */
  static FromArrayRM(arr) {
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
    return new Vec3(this.values[0 + index],
                    this.values[3 + index],
                    this.values[6 + index]);
  }

  /**
   * Retrieve a col from the Mat3 as a Vec3.
   *
   * @param {number} index the index of the column
   *
   * @return {Vec3} the selected column
   */
  col(index) {
    return new Vec3(this.values[index * 3 + 0],
                    this.values[index * 3 + 1],
                    this.values[index * 3 + 2]);
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
    const v00 = this.values[0];
    const v10 = this.values[1];
    const v20 = this.values[2];
    
    const v01 = this.values[3];
    const v11 = this.values[4];
    const v21 = this.values[5];

    const v02 = this.values[6];
    const v12 = this.values[7];
    const v22 = this.values[8];
    
    for (let i = 0; i < 3; ++i) {
      const mat0 = mat.values[i * 3 + 0];
      const mat1 = mat.values[i * 3 + 1];
      const mat2 = mat.values[i * 3 + 2];
    
      this.values[i * 3 + 0] = mat0 * v00 + mat1 * v01 + mat2 * v02;
      this.values[i * 3 + 1] = mat0 * v10 + mat1 * v11 + mat2 * v12;
      this.values[i * 3 + 2] = mat0 * v20 + mat1 * v21 + mat2 * v22;
    }
    
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
    this.values[6] += vec.x * this.values[0]
                    + vec.y * this.values[3];
    
    this.values[7] += vec.x * this.values[1]
                    + vec.y * this.values[4];

    this.values[8] += vec.x * this.values[2]
                    + vec.y * this.values[5];
      
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
    this.values[0] *= vec.x;
    this.values[1] *= vec.x;
    this.values[2] *= vec.x;  
    
    this.values[3] *= vec.y;
    this.values[4] *= vec.y;
    this.values[5] *= vec.y;
    
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
    const v00 = this.values[0];
    const v10 = this.values[1];
    const v20 = this.values[2];
    
    const v01 = this.values[3];
    const v11 = this.values[4];
    const v21 = this.values[5];

    const v02 = this.values[6];
    const v12 = this.values[7];
    const v22 = this.values[8];

    const s = Math.sin(ang);
    const c = Math.cos(ang);

    this.values[0] = c * v00 + s * v01;
    this.values[1] = c * v10 + s * v11;
    this.values[2] = c * v20 + s * v21;
  
    this.values[3] = c * v01 - s * v00;
    this.values[4] = c * v11 - s * v10;
    this.values[5] = c * v21 - s * v20;
    
    return this;
  }

  /**
   * Compute the determinant of the Mat3.
   *
   * @return {number} the determinant
   */
  det() {
    const v00 = this.values[0];
    const v10 = this.values[1];
    const v20 = this.values[2];
    
    const v01 = this.values[3];
    const v11 = this.values[4];
    const v21 = this.values[5];

    const v02 = this.values[6];
    const v12 = this.values[7];
    const v22 = this.values[8];

    return v00 * ( v22 * v11 - v21 * v12)
         + v10 * (-v22 * v01 + v21 * v02)
         + v20 * ( v12 * v01 - v11 * v02)
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
    const v00 = this.values[0];
    const v10 = this.values[1];
    const v20 = this.values[2];
    
    const v01 = this.values[3];
    const v11 = this.values[4];
    const v21 = this.values[5];

    const v02 = this.values[6];
    const v12 = this.values[7];
    const v22 = this.values[8];
    
    const tmp0 =  v22 * v11 - v21 * v12;
    const tmp1 = -v22 * v01 + v21 * v02;
    const tmp2 =  v12 * v01 - v11 * v02;

    var det = v00 * tmp0 + v10 * tmp1 + v20 * tmp2;

    if (det === 0) throw new Error("Unable to inverse matrix if det is zero");    

    det = 1.0 / det;

    this.values[0] = tmp0 * det;
    this.values[1] = (-v22 * v10 + v20 * v12) * det;
    this.values[2] = ( v21 * v10 - v20 * v11) * det;
    this.values[3] = tmp1 * det;
    this.values[4] = ( v22 * v00 - v20 * v02) * det;
    this.values[5] = (-v21 * v00 + v20 * v01) * det;
    this.values[6] = tmp2 * det;
    this.values[7] = (-v12 * v00 + v10 * v02) * det;
    this.values[8] = ( v11 * v00 - v10 * v01) * det;
    
    return this;
  }
}