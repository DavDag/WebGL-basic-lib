/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat4} from "../all.js";

/**
 * @class Matrix Stack implementation.
 */
export class MatrixStack {
  DEPTH_LIMIT = 128;
  #array;

  /**
   * Constructor.
   */
  constructor() {
    this.#array = [Mat4.Identity()];
  }

  /**
   * Retrieve the Matrix at head of the stack.
   * If the Stack is empty, undefined is returned.
   * 
   * @returns {Mat4} the transformation matrix for the entire stack
   */
  head() {
    return (this.size() > 0) ? this.#array[this.size()] : undefined;
  }

  /**
   * Push a Matrix into the stack and returns the new head.
   * 
   * @param {Mat4} mat the matrix to push
   * 
   * @returns {Mat4} the transformation matrix for the entire stack
   */
  push(mat) {
    const tmp = this.#array[this.size()].clone().apply(mat);
    const size = this.#array.push(tmp);
    if (size >= this.DEPTH_LIMIT + 1) {
      throw new Error("Stack depth reached its limit. Be sure to pop() the correct number of times.");
    }
    return tmp;
  }

  /**
   * Remove the Matrix at the top of the stack and returns it.
   * If the Stack is empty, undefined is returned.
   * 
   * @returns {Mat4} the transformation matrix for the entire stack
   */
  pop() {
    return (this.size() > 0) ? this.#array.pop() : undefined;
  }

  /**
   * Retrieve the stack's size.
   * 
   * @returns {number} the stack's size
   */
  size() {
    return this.#array.length - 1;
  }
}
