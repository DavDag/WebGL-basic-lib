/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Vec base vector class.
 */
export class Vec {
  _values;

  /**
   * Creates an instance of a Vec.
   *
   * @param {array of number} arr the array of values
   */
  constructor(arr) {
    this._values = new Float32Array(arr);
  }

  /**
   * Getter to retrieve elements count.
   * Should be implemented by specialized classes.
   * 
   * @return {number} the num of elements
   */
  count() {
    return 0;
  }

  /**
   * Getter to retrieve the values as Float32Array.
   * 
   * @return {Float32Array} values array
   */
  get values() {
    return this._values;
  }

  /**
   * Getter to retrieve a string representing the Vec4 instance.
   * 
   * @return {string} string representation
   */
  toString() {
    return "[" + this._values.join(",") + "]";
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
    for (let i = 0; i < this.count(); ++i)
      this._values[i] += vec._values[i];
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
    for (let i = 0; i < this.count(); ++i)
      this._values[i] -= vec._values[i];
    return this;
  }

  /**
   * Multiply the Vec by a factor.
   * Operations can be concatenated.
   *
   * @param {number} factor the factor to multiply
   *
   * @return {Vec} this
   */
  mul(factor) {
    for (let i = 0; i < this.count(); ++i)
      this._values[i] *= factor;
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
    for (let i = 0; i < this.count(); ++i)
      sum += this._values[i] * vec._values[i];
    return sum;
  }
}