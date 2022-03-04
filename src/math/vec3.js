/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec} from "./vec.js";
import {Vec2} from "./vec2.js";

/**
 * @class Vec3 representing a vector with 3 dimensions.
 */
export class Vec3 extends Vec {  
  /**
   * Creates an instance of a Vec3.
   *
   * @param {number} the x coordinate
   * @param {number} the y coordinate
   * @param {number} the z coordinate
   */
  constructor(x, y, z) {
    super([x, y, z]);
  }

  /**
   * Getter to retrieve elements count.
   * 
   * @return {number} the num of elements
   */
  static count() {
    return 3;
  }

  /**
   * Syntactic-sugar for a Vec3 initialization with an array.
   *
   * @return {Vec3} the newly created vector
   */
  static FromArray(arr) {
    return new Vec3(arr[0], arr[1], arr[2]);
  }

  /**
   * Syntactic-sugar for a Vec2 initialization from a Vec3.
   *
   * @return {Vec2} the newly created vector
   */
  toVec2() {
    return new Vec2(this.x, this.y);
  }

  /**
   * Setter to update the x, y or z coordinate.
   * 
   * @param {number} the new value
   */
  set x(value) { this.values[0] = value; }
  set y(value) { this.values[1] = value; }
  set z(value) { this.values[2] = value; }

  // Syntactic sugar to support "color" channels as coordinates
  set r(value) { this.values[0] = value; }
  set g(value) { this.values[1] = value; }
  set b(value) { this.values[2] = value; }

  /**
   * Getter to retrieve the x, y or z coordinate.
   * 
   * @return {number} the selected coordinate
   */
  get x() { return this.values[0]; }
  get y() { return this.values[1]; }
  get z() { return this.values[2]; }
  
  // Syntactic sugar to support "color" channels as coordinates
  get r() { return this.values[0]; }
  get g() { return this.values[1]; }
  get b() { return this.values[2]; }

  /**
   * Compute the cross product with another vector.
   * Operations can be concatenated.
   *
   * @param {Vec3} vec the vector to multiply
   *
   * @return {Vec3} this
   */
  cross(vec) {
    const v0 = this.values[0];
    const v1 = this.values[1];
    const v2 = this.values[2];

    this.values[0] = (v1 * vec.z) - (v2 * vec.y);
    this.values[1] = (v2 * vec.x) - (v0 * vec.z);
    this.values[2] = (v0 * vec.y) - (v1 * vec.x);
    
    return this;
  }

  /*
   * Calculate texture uvs of sphere with Vec3 as point.
   *
   * Should be normalized.
   *
   * @return {Vec2} the uv coordinates
   */
  toUVofSphere() {
    const u = (Math.atan2(this.values[0], this.values[2]) / Math.PI) / 2 + 0.5;
    const v = (Math.asin(-this.values[1]) / (Math.PI / 2)) / 2 + 0.5;
    return new Vec2(u, v);
  }
}