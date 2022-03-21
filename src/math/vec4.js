/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec} from "./vec";
import {Vec2, Vec3} from "../all";

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
  static count() {
    return 4;
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
   * Syntactic-sugar for a Vec2 initialization from a Vec4.
   *
   * @return {Vec2} the newly created vector
   */
  toVec2() {
    return new Vec2(this.x, this.y);
  }

  /**
   * Syntactic-sugar for a Vec3 initialization from a Vec4.
   *
   * @return {Vec3} the newly created vector
   */
  toVec3() {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Setter to update the x, y, z or w coordinate.
   * 
   * @param {number} the new value
   */
  set x(value) { this.values[0] = value; }
  set y(value) { this.values[1] = value; }
  set z(value) { this.values[2] = value; }
  set w(value) { this.values[3] = value; }

  // Syntactic sugar to support "color" channels as coordinates
  set r(value) { this.values[0] = value; }
  set g(value) { this.values[1] = value; }
  set b(value) { this.values[2] = value; }
  set a(value) { this.values[3] = value; }

  /**
   * Getter to retrieve the x, y, z or w coordinate.
   * 
   * @return {number} the selected coordinate
   */
  get x() { return this.values[0]; }
  get y() { return this.values[1]; }
  get z() { return this.values[2]; }
  get w() { return this.values[3]; }
  
  // Syntactic sugar to support "color" channels as coordinates
  get r() { return this.values[0]; }
  get g() { return this.values[1]; }
  get b() { return this.values[2]; }
  get a() { return this.values[3]; }
}