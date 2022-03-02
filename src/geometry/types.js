/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Shape representing a generic geometry.
 */
class Shape {
  verteces;
  triangles;
  
  /**
   * Creates an instance of a Shape.
   *
   * @param {list of number} verteces the verteces list
   * @param {list of number} triangles the triangles list
   */
  constructor(verteces, triangles) {
    this.verteces = new Float32Array(verteces);
    this.triangles = new Uint16Array(triangles);
  }

  /**
   * Getter to retrieve data count per vertex.
   * Should be implemented by specialized classes.
   * 
   * @return {number} the vertex size
   */
  static vertexSize() {
    throw new Error("vertexSize() not implemented");
  }

  /**
   * Estimate memory cost of the shape.
   *
   * @return {number, number, number} the memory occupation
   */
  memoryCost() {
    return {
      num_vert: this.verteces.length / this.constructor.vertexSize(),
      num_elem: this.triangles.length,
      bytes: this.verteces.length * 4 + this.triangles.length * 2
    }
  }

  /**
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
 * - triangles array of { indices }
 */
export class BasicShape extends Shape {
  /**
   * Creates an instance of a BasicShape.
   *
   * @param {list of Vec3} verteces the verteces list
   * @param {list of Vec3} triangles the triangles list
   */
  constructor(verteces, triangles) {
    super(
      Shape.flattenVecArray(verteces),
      Shape.flattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static vertexSize() {
    return 3;
  }
}

/**
 * @class TexturedShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos, 2D-Texture-Coord }
 * - triangles array of { indices }
 */
export class TexturedShape extends Shape {
  /**
   * Creates an instance of a TexturedShape.
   *
   * @param {list of Vec3} verteces the verteces list
   * @param {list of Vec2} uvs the uvs list
   * @param {list of Vec3} triangles the triangles list
   */
  constructor(verteces, uvs, triangles) {
    super(
      TexturedShape.#combine(verteces, uvs),
      Shape.flattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static vertexSize() {
    return 5;
  }

  /**
   *
   */
  static #combine(verteces, uvs) {
    return verteces.map((v, ind) => [...v.values, ...uvs[ind].values]).flat();
  }
}

/**
 * @class DebugShape representing a basic geometry defined by:
 * - verteces array of { 3D-Pos, 3D-Normal, 2D-Texture-Coord }
 * - triangles array of { indices }
 * - lines array of { indices }
 */
export class DebugShape extends Shape {
  lines;
  
  /**
   * Creates an instance of a DebugShape.
   *
   * @param {list of Vec3} verteces the verteces list
   * @param {list of Vec3} normal the normal list
   * @param {list of Vec2} uvs the uvs list
   * @param {list of Vec3} triangles the triangles list
   * @param {list of Vec2} lines the lines list
   */
  constructor(verteces, normals, uvs, triangles, lines) {
    super(
      DebugShape.#combine(verteces, normlas, uvs),
      Shape.flattenVecArray(triangles)
    );
    this.lines = Shape.flattenVecArray(lines);
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static vertexSize() {
    return 8;
  }

  /**
   *
   */
  static #combine(verteces, normals, uvs) {
    return verteces.map(
      (v, ind) => [...v.values, ...normals[ind].values, ...uvs[ind].values]
    ).flat();
  }
}