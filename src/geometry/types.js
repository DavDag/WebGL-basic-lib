/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Shape representing a generic geometry.
 */
class Shape {
  verteces;
  elements;
  
  /**
   * Creates an instance of a Shape.
   *
   * @param {list of number} verteces the verteces list
   * @param {list of number} elements the elements list
   */
  constructor(verteces, elements) {
    this.verteces = new Float32Array(verteces);
    this.elements = new Uint16Array(elements);
  }

  /*
   * Estimate memory cost of the shape.
   *
   * @return {number, number, number} the memory occupation
   */
  memoryCost() {
    return {
      num_vert: this.verteces.length,
      num_elem: this.elements.length,
      bytes: this.verteces.length * 4 + this.elements.length * 2
    }
  }

  /*
   * Estimate memory cost of the shape.
   *
   * @param {list of Vec} array the array to flatten
   *
   * @return {array} a plain JS array
   */
  static flattenVecArray(array) {
    return array.map((v) => [...v.values]).flat();
  }
}

/**
 * @class BasicShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos }
 * - elements array of { indices }
 */
export class BasicShape extends Shape {
  /**
   * Creates an instance of a BasicShape.
   *
   * @param {list of Vec3} verteces the verteces list
   * @param {list of Vec3} elements the elements list
   */
  constructor(verteces, elements) {
    super(
      Shape.flattenVecArray(verteces),
      Shape.flattenVecArray(elements)
    );
  }
}

/**
 * @class TexturedShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos, 2D-Texture-Coord }
 * - elements array of { indices }
 */
export class TexturedShape extends Shape {
  /**
   * Creates an instance of a TexturedShape.
   *
   * @param {list of Vec3} verteces the verteces list
   * @param {list of Vec2} verteces the verteces list
   * @param {list of Vec3} elements the elements list
   */
  constructor(verteces, uvs, elements) {
    super(
      TexturedShape.#combine(verteces, uvs),
      Shape.flattenVecArray(elements)
    );
  }

  static #combine(verteces, uvs) {
    return verteces.map((v, ind) => [...v.values, ...uvs[ind].values]).flat();
  }
}