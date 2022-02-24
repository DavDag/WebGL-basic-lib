/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec} from "./vec.js";

/**
 * @class Vec4 representing a vector with 4 dimensions.
 */
export class Vec4 extends Vec {  
  /**
   * Creates an instance of a Vec4.
   *
   * @param {number} the x coordinate
   * @param {number} the y coordinate
   * @param {number} the z coordinate
   * @param {number} the w coordinate
   */
  constructor(x, y, z, w) {
    super([x, y, z, w]);
  }

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  count() {
    return 4;
  }

  /**
   * Setter to update the x, y, z or w coordinate.
   * 
   * @param {number} the new value
   */
  set x(value) { this._values[0] = value; }
  set y(value) { this._values[1] = value; }
  set z(value) { this._values[2] = value; }
  set w(value) { this._values[3] = value; }

  // Syntactic sugar to support "color" channels as coordinates
  set r(value) { this._values[0] = value; }
  set g(value) { this._values[1] = value; }
  set b(value) { this._values[2] = value; }
  set a(value) { this._values[3] = value; }

  /**
   * Getter to retrieve the x, y, z or w coordinate.
   * 
   * @return {number} the selected coordinate
   */
  get x() { return this._values[0]; }
  get y() { return this._values[1]; }
  get z() { return this._values[2]; }
  get w() { return this._values[3]; }
  
  // Syntactic sugar to support "color" channels as coordinates
  get r() { return this._values[0]; }
  get g() { return this._values[1]; }
  get b() { return this._values[2]; }
  get a() { return this._values[3]; }

  /**
   * Syntactic-sugar for a Vec4 initialization from another Vec4.
   *
   * @return {Vec4} the newly created vector
   */
  static Copy(vec) {
    return Vec4.FromArray(vec.values);
  }

  /**
   * Syntactic-sugar for a Vec4 initialization with an array.
   *
   * @return {Vec4} the newly created vector
   */
  static FromArray(arr) {
    return new Vec4(arr[0], arr[1], arr[2], arr[3]);
  }

  /**
   * Syntactic-sugar for a Vec4 initialization with equal values.
   *
   * @param {number} v the value to repeat
   *
   * @return {Vec4} the newly created vector
   */
  static All(v) {
    return new Vec4(v, v, v, v);
  }

  /**
   * Syntactic-sugar for a Vec4 initialization with zeros.
   *
   * @return {Vec4} the newly created vector
   */
  static Zeros() {
    return new Vec4(0, 0, 0, 0);
  }

  /**
   * Syntactic-sugar for a Vec4 initialization with ones.
   *
   * @return {Vec4} the newly created vector
   */
  static Ones(v) {
    return new Vec4(1, 1, 1, 1);
  }
}