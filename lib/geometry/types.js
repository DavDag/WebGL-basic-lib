/** @author: Davide Risaliti davdag24@gmail.com */

import {Debug} from "../all.js";

/**
 * @class Generable that can be extended by any generable shape that implements _build().
 */
export class Generable {
  
  /**
   * Creates a BasicShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {BasicShape} the generated shape
   */
   static asBasicShape(args) {
    const { vertexes, triangles } = this._build(...arguments);
    return new BasicShape(vertexes, triangles);
  }
  
  /**
   * Creates a TexturedShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {TexturedShape} the generated shape
   */
  static asTexturedShape(args) {
    const { vertexes, uvs, triangles } = this._build(...arguments);
    return new TexturedShape(vertexes, uvs, triangles);
  }
  
  /**
   * Creates a AdvancedShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {AdvancedShape} the generated shape
   */
  static asAdvancedShape(args) {
    const { vertexes, uvs, normals, triangles } = this._build(...arguments);
    return new AdvancedShape(vertexes, uvs, normals, triangles);
  }
  
  /**
   * Creates a DebugShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {DebugShape} the generated shape
   */
  static asDebugShape(args) {
    const { vertexes, uvs, normals, triangles, lines } = this._build(...arguments);
    return new DebugShape(vertexes, uvs, normals, triangles, lines);
  }

  /**
   * Method to create the shape.
   * Should be implemented by specialized classes.
   * 
   * @returns {vertexes, uvs, normals, triangles, lines}
   */
  static _build() {
    throw new Error("_build() not implemented");
  }
}

/**
 * @class Shape representing a generic geometry.
 */
export class Shape {
  vertexes;
  numVertexes;
  triangles;
  numTriangles;
  
  /**
   * Creates an instance of a Shape.
   *
   * @param {list of number} vertexes
   * @param {list of number} triangles
   */
  constructor(vertexes, triangles) {
    this.vertexes = new Float32Array(vertexes);
    this.numVertexes = this.vertexes.length / this.constructor.VertexSize();
    this.triangles = new Uint16Array(triangles);
    this.numTriangles = this.triangles.length / 3;
  }

  /**
   * Getter to retrieve data count per vertex.
   * Should be implemented by specialized classes.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    throw new Error("VertexSize() not implemented");
  }

  /**
   * Syntactic sugar to retrieve vertex size from instances.
   * 
   * @return {number} the vertex size
   */
  vertexSize() {
    return this.constructor.VertexSize();
  }

  /**
   * Estimate memory cost of the shape.
   *
   * @return {number, number, number} the memory occupation
   */
  get bytes() {
    return this.vertexes.length * 4 + this.triangles.length * 2;
  }

  /**
   * Flatten the array.
   *
   * ex.
   *     a = [(0, 1), (2, 3)]
   *
   *     flattenVecArray(a) = [0, 1, 2, 3]
   *
   * @param {list of Vec} array the array to flatten
   *
   * @return {array} a plain JS array
   */
  static flattenVecArray(array) {
    return Shape.flattenVecArrays([array]);
  }
  
  /**
   * Flatten the arrays combining each element from each array.
   *
   * ex.
   *     a = [(0, 1), (2, 3)]
   *     b = [(4, 5), (6, 7)]
   *
   *     flattenVecArrays([a, b]) = [0, 1, 4, 5, 2, 3, 6, 7]
   *
   * @param {list of list of Vec} arrays the array list to flatten
   *
   * @return {array} a plain JS array
   */
  static flattenVecArrays(arrays) {
    return arrays[0].map((_, ind) => arrays.map((a) => [...a[ind].values]).flat()).flat();
  }

  /**
   * Debug draw points for each vertex.
   *
   * Works only when using the DebugShape.
   */
  drawPoints(mat, color, size) { }

  /**
   * Debug draw lines for each segment.
   *
   * Works only when using the DebugShape.
   */
  drawLines(mat, color) { }
}

/**
 * @class BasicShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos }
 * - triangles array of { indices }
 */
export class BasicShape extends Shape {
  /**
   * Creates an instance of a BasicShape.
   *
   * @param {list of Vec3} vertexes
   * @param {list of Vec3} triangles
   */
  constructor(vertexes, triangles) {
    super(
      Shape.flattenVecArray(vertexes),
      Shape.flattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 3;
  }
}

/**
 * @class TexturedShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos, 2D-Texture-Coord }
 * - triangles array of { indices }
 */
export class TexturedShape extends Shape {
  /**
   * Creates an instance of a TexturedShape.
   *
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} triangles
   */
  constructor(vertexes, uvs, triangles) {
    super(
      Shape.flattenVecArrays([vertexes, uvs]),
      Shape.flattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 5;
  }
}

/**
 * @class AdvancedShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos, 2D-Texture-Coord, 3D-Normal }
 * - triangles array of { indices }
 */
export class AdvancedShape extends Shape {
  /**
   * Creates an instance of a AdvancedShape.
   *
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} normals
   * @param {list of Vec3} triangles
   */
  constructor(vertexes, uvs, normals, triangles) {
    super(
      Shape.flattenVecArrays([vertexes, uvs, normals]),
      Shape.flattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 8;
  }
}

/**
 * @class DebugShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos, 2D-Texture-Coord, 3D-Normal }
 * - triangles array of { indices }
 * - lines array of { indices }
 */
export class DebugShape extends Shape {
  lines;
  numLines;
  
  /**
   * Creates an instance of a DebugShape.
   *
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} normals
   * @param {list of Vec3} triangles
   * @param {list of Vec2} lines
   */
  constructor(vertexes, uvs, normals, triangles, lines) {
    super(
      Shape.flattenVecArrays([vertexes, uvs, normals]),
      Shape.flattenVecArray(triangles)
    );
    this.lines = new Uint16Array(Shape.flattenVecArray(lines));
    this.numLines = this.lines.length / 2;
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 8;
  }

  /**
   * Estimate memory cost of the shape.
   *
   * @return {number, number, number} the memory occupation
   */
  get bytes() {
    return super.bytes + this.lines.length * 2;
  }

  /**
   * Debug draw points for each vertex.
   *
   * @param {Mat4} mat the transformation matrix
   * @param {Vec4} color the color of each point
   * @param {number} size the size of each point
   */
  drawPoints(mat, color, size) {
    Debug.drawPoints(this.vertexes, this.vertexSize(), mat, this.numVertexes, color, size);
  }

  /**
   * Debug draw lines for each segment.
   *
   * @param {Mat4} mat the transformation matrix
   * @param {Vec4} color the color of each point
   */
  drawLines(mat, color) {
    Debug.drawLines(this.vertexes, this.lines, this.vertexSize(), mat, this.numLines, color);
  }
}
