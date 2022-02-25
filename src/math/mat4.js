/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat} from "./mat.js";
import {Vec4} from "./vec4.js";

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

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  static count() {
    return 16;
  }

  /**
   * Getter to retrieve side count.
   * 
   * @return {number} the num of elements on the side of the matrix
   */
  static side() {
    return 4;
  }

  /**
   * Syntactic-sugar for a Mat4 initialization with an array.
   *
   * @return {Mat4} the newly created vector
   */
  static FromArray(arr) {
    return new Mat4(arr[ 0], arr[ 1], arr[ 2], arr[ 3],
                    arr[ 4], arr[ 5], arr[ 6], arr[ 7],
                    arr[ 8], arr[ 9], arr[10], arr[11],
                    arr[12], arr[13], arr[14], arr[15]);
  }

  /**
   * Retrieve an element from the Mat4.
   *
   * @param {number} row index of the row
   * @param {number} col index of the column
   *
   * @return {number} the number in position [row][col]
   */
  get(row, col) {
    return this.values[row * 4 + col];
  }

  /**
   * Update an element from the Mat4.
   *
   * @param {number} row index of the row
   * @param {number} col index of the column
   */
  set(row, col, value) {
    this.values[row * 4 + col] = value;
  }

  /**
   * Retrieve a row from the Mat4 as a Vec4.
   *
   * @param {number} index the index of the row
   *
   * @return {Vec4} the selected row
   */
  row(index) {
    return new Vec4(this.values[index * 4 + 0],
                    this.values[index * 4 + 1],
                    this.values[index * 4 + 2],
                    this.values[index * 4 + 3]);
  }

  /**
   * Retrieve a col from the Mat4 as a Vec4.
   *
   * @param {number} index the index of the column
   *
   * @return {Vec4} the selected column
   */
  col(index) {
    return new Vec4(this.values[ 0 + index],
                    this.values[ 4 + index],
                    this.values[ 8 + index],
                    this.values[12 + index]);
  }

  /**
   * Apply the transformation to the Mat4.
   * Operations can be concatenated.
   *
   * @param {Mat4} mat the matrix to apply
   *
   * @return {Mat4} this
   */
  multiply(mat) {
    return this;
  }

  /**
   * Apply the translation to the Mat4.
   * Operations can be concatenated.
   *
   * @param {Vec3} vec the translation to apply
   *
   * @return {Mat4} this
   */
  translate(vec) {
    return this;
  }

  /**
   * Apply the scale to the Mat4.
   * Operations can be concatenated.
   *
   * @param {Vec3} vec the scale to apply
   *
   * @return {Mat4} this
   */
  scale(vec) {
    return this;
  }

  /**
   * Apply the rotation to the Mat4.
   * Operations can be concatenated.
   *
   * @param {number} ang the angle to rotate
   * @param {Vec3} vec the axis to rotate around
   *
   * @return {Mat4} this
   */
  rotate(ang, vec) {
    return this;
  }

  /**
   * Compute the determinant of the Mat4.
   *
   * @return {number} the determinant
   */
  det() {
    const v00 = this.values[ 0];
    const v01 = this.values[ 1];
    const v02 = this.values[ 2];
    const v03 = this.values[ 3];
    
    const v10 = this.values[ 4];
    const v11 = this.values[ 5];
    const v12 = this.values[ 6];
    const v13 = this.values[ 7];
    
    const v20 = this.values[ 8];
    const v21 = this.values[ 9];
    const v22 = this.values[10];
    const v23 = this.values[11];
    
    const v30 = this.values[12];
    const v31 = this.values[13];
    const v32 = this.values[14];
    const v33 = this.values[15];
    
    const tmp0 = v00 * v11 - v10 * v01;
    const tmp1 = v00 * v21 - v20 * v01;
    const tmp2 = v10 * v21 - v20 * v11;
    const tmp3 = v02 * v13 - v12 * v03;
    const tmp4 = v02 * v23 - v22 * v03;
    const tmp5 = v12 * v23 - v22 * v13;

    const tmp6 = v00 * tmp5 - v10 * tmp4 + v20 * tmp3;
    const tmp7 = v01 * tmp5 - v11 * tmp4 + v21 * tmp3;
    const tmp8 = v02 * tmp2 - v12 * tmp1 + v22 * tmp0;
    const tmp9 = v03 * tmp2 - v13 * tmp1 + v23 * tmp0;

    return v31 * tmp6 - v30 * tmp7 + v33 * tmp8 - v32 * tmp9;
  }

  /**
   * Compute the inverse of the Mat4.
   * Operations can be concatenated.
   *
   * @return {Mat} this
   */
  inverse() {
    const v00 = this.values[ 0];
    const v01 = this.values[ 1];
    const v02 = this.values[ 2];
    const v03 = this.values[ 3];
    
    const v10 = this.values[ 4];
    const v11 = this.values[ 5];
    const v12 = this.values[ 6];
    const v13 = this.values[ 7];
    
    const v20 = this.values[ 8];
    const v21 = this.values[ 9];
    const v22 = this.values[10];
    const v23 = this.values[11];
    
    const v30 = this.values[12];
    const v31 = this.values[13];
    const v32 = this.values[14];
    const v33 = this.values[15];

    const tmp0  = v00 * v11 - v10 * v01;
    const tmp1  = v00 * v21 - v20 * v01;
    const tmp2  = v00 * v31 - v30 * v01;
    const tmp3  = v10 * v21 - v20 * v11;
    const tmp4  = v10 * v31 - v30 * v11;
    const tmp5  = v20 * v31 - v30 * v21;
    const tmp6  = v02 * v13 - v12 * v03;
    const tmp7  = v02 * v23 - v22 * v03;
    const tmp8  = v02 * v33 - v32 * v03;
    const tmp9  = v12 * v23 - v22 * v13;
    const tmp10 = v12 * v33 - v32 * v13;
    const tmp11 = v22 * v33 - v32 * v23;
    
    var det = tmp0 * tmp11 - tmp1 * tmp10 + tmp2 * tmp9
            + tmp3 * tmp8  - tmp4 * tmp7  + tmp5 * tmp6;

    if (det === 0) throw new Error("Unable to inverse matrix if det is zero");    

    det = 1.0 / det;

    this.values[ 0] = (v11 * tmp11 - v21 * tmp10 + v31 * tmp9 ) * det;
    this.values[ 4] = (v20 * tmp10 - v10 * tmp11 - v30 * tmp9 ) * det;
    this.values[ 8] = (v13 * tmp5  - v23 * tmp4  + v33 * tmp3 ) * det;
    this.values[12] = (v22 * tmp4  - v12 * tmp5  - v32 * tmp3 ) * det;
    this.values[ 1] = (v21 * tmp8  - v01 * tmp11 - v31 * tmp7 ) * det;
    this.values[ 5] = (v00 * tmp11 - v20 * tmp8  + v30 * tmp7 ) * det;
    this.values[ 9] = (v23 * tmp2  - v03 * tmp5  - v33 * tmp1 ) * det;
    this.values[13] = (v02 * tmp5  - v22 * tmp2  + v32 * tmp1 ) * det;
    this.values[ 2] = (v01 * tmp10 - v11 * tmp8  + v31 * tmp6 ) * det;
    this.values[ 6] = (v10 * tmp8  - v00 * tmp10 - v30 * tmp6 ) * det;
    this.values[10] = (v03 * tmp4  - v13 * tmp2  + v33 * tmp0 ) * det;
    this.values[14] = (v12 * tmp2  - v02 * tmp4  - v32 * tmp0 ) * det;
    this.values[ 3] = (v11 * tmp7  - v01 * tmp9  - v21 * tmp6 ) * det;
    this.values[ 7] = (v00 * tmp9  - v10 * tmp7  + v20 * tmp6 ) * det;
    this.values[11] = (v13 * tmp1  - v03 * tmp3  - v23 * tmp0 ) * det;
    this.values[15] = (v02 * tmp3  - v12 * tmp1  + v22 * tmp0 ) * det;

    return this;
  }
}