/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Vec base vector class.
 */
export class Vec {
  values;

  /**
   * Creates an instance of a Vec.
   *
   * @param {array of number} arr the array of values
   */
  constructor(arr) {
    this.values = new Float32Array(arr);
  }

  /**
   * Getter to retrieve elements count.
   * Should be implemented by specialized classes.
   * 
   * @return {number} the num of elements
   */
  static count() {
    throw new Error("count() not implemented");
  }

  /**
   * Syntactic-sugar for a Vec initialization from array.
   * Should be implemented by specialized classes.
   * 
   * @param {array of number} arr the array to copy
   * 
   * @return {Vec} the newly created vector
   */
  static FromArray(arr) {
    throw new Error("FromArray() not implemented");
  }

  /**
   * Getter to retrieve a string representing the Vec instance.
   * 
   * @return {string} string representation
   */
  toString() {
    return "[" + this.values.join(",") + "]";
  }

  /**
   * Compare the two Vec.
   *
   * @param {Vec} vec the vector to compare
   *
   * @return {boolean} if the Vec are equals
   */
  equals(vec) {
    for (let i = 0; i < this.constructor.count(); ++i)
      if (this.values[i] !== vec.values[i])
        return false;
    return true;
  }

  /**
   * Sum to the Vec another Vec.
   * Operations can be concatenated.
   *
   * @param {Vec} vec the vector to sum
   *
   * @return {Vec} this
   */
  add(vec) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] += vec.values[i];
    return this;
  }

  /**
   * Subtract to the Vec another Vec.
   * Operations can be concatenated.
   *
   * @param {Vec} vec the vector to subtract
   *
   * @return {Vec} this
   */
  sub(vec) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] -= vec.values[i];
    return this;
  }

  /**
   * Scale up the Vec by a factor.
   * Operations can be concatenated.
   *
   * @param {number} factor the scale
   *
   * @return {Vec} this
   */
  mul(factor) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] *= factor;
    return this;
  }

  /**
   * Scale down the Vec by a factor.
   * Operations can be concatenated.
   *
   * @param {number} factor the scale
   *
   * @return {Vec} this
   */
  div(factor) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] /= factor;
    return this;
  }

  /**
   * Round the Vec.
   * Operations can be concatenated.
   *
   * @param {number} decimal the decimal places to left
   *
   * @return {Vec} this
   */
  round(decimal) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] = this.values[i].toFixed(decimal);
    return this;
  }

  /**
   * Normalize the Vec.
   * Operations can be concatenated.
   *
   * @return {Vec} this
   */
  normalize() {
    return this.div(this.magnitude());
  }

  /**
   * Inverse the Vec.
   * Operations can be concatenated.
   *
   * @return {Vec} this
   */
  inverse() {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] = 1 / this.values[i];
    return this;
  }

  /**
   * Negate the Vec.
   * Operations can be concatenated.
   *
   * @return {Vec} this
   */
  negate() {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] = -this.values[i];
    return this;
  }

  /**
   * Compute the dot product between Vec.
   *
   * @param {Vec} vec the vector to multiply
   *
   * @return {number} the result of the computation
   */
  dot(vec) {
    let sum = 0;
    for (let i = 0; i < this.constructor.count(); ++i)
      sum += this.values[i] * vec.values[i];
    return sum;
  }

  /**
   * Compute the length of the Vec.
   *
   * @return {number} the length
   */
  magnitude() {
    return Math.sqrt(this.magnitude_squared());
  }

  /**
   * Compute the length squared of the Vec.
   *
   * @return {number} the length squared
   */
  magnitude_squared() {
    return this.dot(this);
  }

  /**
   * Syntactic-sugar for a Vec clone.
   * 
   * @return {Vec} the newly created vector
   */
  clone() {
    return this.constructor.FromArray(this.values);
  }

  /**
   * Syntactic-sugar for a Vec initialization with equal values.
   * 
   * @param {number} v the value to be used for every coordinate
   * 
   * @return {Vec} the newly created vector
   */
  static All(v) {
    return this.FromArray(new Array(this.count()).fill(v));
  }

  /**
   * Syntactic-sugar for a Vec initialization with zeros.
   *
   * @return {Vec} the newly created vector
   */
  static Zeros() {
    return this.All(0);
  }

  /**
   * Syntactic-sugar for a Vec initialization with ones.
   *
   * @return {Vec} the newly created vector
   */
  static Ones() {
    return this.All(1);
  }
}