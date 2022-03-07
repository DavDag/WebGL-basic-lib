/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec} from "./vec.js";
import {Vec3} from "./vec3.js";
import {Vec4} from "./vec4.js";

/**
 * @class Vec2 representing a vector with 2 dimensions.
 */
export class Vec2 extends Vec {  
  /**
   * Creates an instance of a Vec2.
   *
   * @param {number} the x coordinate
   * @param {number} the y coordinate
   */
  constructor(x, y) {
    super([x, y]);
  }

  /**
   * Syntactic-sugar for a Vec3 initialization from a Vec2.
   *
   * @param {number} z the z coordinate
   *
   * @return {Vec3} the newly created vector
   */
  toVec3(z) {
    return new Vec3(this.x, this.y, z);
  }

  /**
   * Syntactic-sugar for a Vec4 initialization from a Vec2.
   *
   * @param {number} z the z coordinate
   * @param {number} w the w coordinate
   *
   * @return {Vec4} the newly created vector
   */
  toVec4(z, w) {
    return new Vec4(this.x, this.y, z, w);
  }

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  static count() {
    return 2;
  }

  /**
   * Syntactic-sugar for a Vec2 initialization with an array.
   *
   * @return {Vec2} the newly created vector
   */
  static FromArray(arr) {
    return new Vec2(arr[0], arr[1]);
  }

  /**
   * Setter to update the x or y coordinate.
   * 
   * @param {number} the new value
   */
  set x(value) { this.values[0] = value; }
  set y(value) { this.values[1] = value; }

  // Syntactic sugar to support "size" accessors as coordinates
  set w(value) { this.values[0] = value; }
  set h(value) { this.values[1] = value; }

  /**
   * Getter to retrieve the x or y coordinate.
   * 
   * @return {number} the selected coordinate
   */
  get x() { return this.values[0]; }
  get y() { return this.values[1]; }
  
  // Syntactic sugar to support "size" accessors as coordinates
  get w() { return this.values[0]; }
  get h() { return this.values[1]; }
}