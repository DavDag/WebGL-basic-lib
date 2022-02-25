/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Mat base vector class.
 */
export class Mat {
  values;

  /**
   * Creates an instance of a Mat.
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
   * Getter to retrieve side count.
   * Should be implemented by specialized classes.
   * 
   * @return {number} the num of elements on a side of the matrix
   */
  static side() {
    throw new Error("side() not implemented");
  }

  /**
   * Syntactic-sugar for a Mat initialization from array.
   * Should be implemented by specialized classes.
   * 
   * @param {array of number} arr the array to copy
   * 
   * @return {Mat} the newly created vector
   */
  static FromArray(arr) {
    throw new Error("FromArray() not implemented");
  }

  /**
   * Getter to retrieve a string representing the Mat instance.
   * 
   * @return {string} string representation
   */
  toString() {
    const rows = new Array(this.constructor.side()).fill(0)
      .map((el, ind) => "\t"+ this.row(ind).toString());
    return "[\n" + rows.join(",\n") + "\n]";
  }

  /**
   * Compare the two Mat.
   *
   * @param {Mat} mat the matrix to compare
   *
   * @return {boolean} if the Mat are equals
   */
  equals(mat) {
    for (let i = 0; i < this.constructor.count(); ++i)
      if (this.values[i] !== vec.values[i])
        return false;
    return true;
  }

  /**
   * Round the Mat.
   * Operations can be concatenated.
   *
   * @param {number} decimal the decimal places to left
   *
   * @return {Mat} this
   */
  round(decimal) {
    for (let i = 0; i < this.constructor.count(); ++i)
      this.values[i] = this.values[i].toFixed(decimal);
    return this;
  }

  /**
   * Transpose the Mat.
   * Operations can be concatenated.
   *
   * @return {Mat} this
   */
  transpose() {
    for (let r = 0; r < this.constructor.side(); ++r)
      for (let c = r + 1; c < this.constructor.side(); ++c) {
        const tmp = this.get(r, c);
        this.set(r, c, this.get(c, r));
        this.set(c, r, tmp);
      }
    return this;
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
   * Syntactic-sugar for a Mat initialization with zeros.
   *
   * @return {Mat} the newly created vector
   */
  static Identity() {
    const arr = new Array(this.count()).fill(0);
    for (let i = 0; i < this.count(); ++i)
      if ((i % (this.side() + 1)) === 0)
        arr[i] = 1;
    return this.FromArray(arr);
  }

  /**
   * Syntactic-sugar for a Mat initialization with equal values.
   * 
   * @param {number} v the value to be used for every coordinate
   * 
   * @return {Mat} the newly created vector
   */
  static All(v) {
    return this.FromArray(new Array(this.count()).fill(v));
  }

  /**
   * Syntactic-sugar for a Mat initialization with zeros.
   *
   * @return {Mat} the newly created vector
   */
  static Zeros() {
    return this.All(0);
  }

  /**
   * Syntactic-sugar for a Mat initialization with ones.
   *
   * @return {Mat} the newly created vector
   */
  static Ones() {
    return this.All(1);
  }
}