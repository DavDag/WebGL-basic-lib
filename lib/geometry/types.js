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
    const name = this.prototype.constructor.name;
    return new BasicShape(name, vertexes, triangles);
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
    const name = this.prototype.constructor.name;
    return new TexturedShape(name, vertexes, uvs, triangles);
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
    const name = this.prototype.constructor.name;
    return new AdvancedShape(name, vertexes, uvs, normals, triangles);
  }
  
  /**
   * Creates a RealisticShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {RealisticShape} the generated shape
   */
  static asRealisticShape(args) {
    const { vertexes, uvs, normals, tangents, triangles } = this._build(...arguments);
    const name = this.prototype.constructor.name;
    return new RealisticShape(name, vertexes, uvs, normals, tangents, triangles);
  }
  
  /**
   * Creates a DebugShape
   * 
   * @param {...} args the arguments to build the selected shape.
   *
   * @return {DebugShape} the generated shape
   */
  static asDebugShape(args) {
    const { vertexes, uvs, normals, tangents, triangles, lines } = this._build(...arguments);
    const name = this.prototype.constructor.name;
    return new DebugShape(name, vertexes, uvs, normals, tangents, triangles, lines);
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
  name;
  vertexes;
  numVertexes;
  triangles;
  numTriangles;
  
  /**
   * Creates an instance of a Shape.
   *
   * @param {string} name the name of the shape
   * @param {list of number} vertexes
   * @param {list of number} triangles
   */
  constructor(name, vertexes, triangles) {
    this.name = name;
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
   *     FlattenVecArray(a) = [0, 1, 2, 3]
   *
   * @param {list of Vec} array the array to flatten
   *
   * @return {array} a plain JS array
   */
  static FlattenVecArray(array) {
    return Shape.FlattenVecArrays([array]);
  }
  
  /**
   * Flatten the arrays combining each element from each array.
   *
   * ex.
   *     a = [(0, 1), (2, 3)]
   *     b = [(4, 5), (6, 7)]
   *
   *     FlattenVecArrays([a, b]) = [0, 1, 4, 5, 2, 3, 6, 7]
   *
   * @param {list of list of Vec} arrays the array list to flatten
   *
   * @return {array} a plain JS array
   */
  static FlattenVecArrays(arrays) {
    return arrays[0].map((_, ind) => arrays.map((a) => [...a[ind].values]).flat()).flat();
  }

  /**
   * Debug draw points for each vertex.
   * Works only when using the DebugShape.
   * 
   * @param {Mat4} mat the transformation matrix
   * @param {Vec4} color the points color
   * @param {number} size the point size
   */
  drawPoints(mat, color, size) { }

  /**
   * Debug draw lines for each segment.
   * Works only when using the DebugShape.
   * 
   * @param {Mat4} mat the transformation matrix
   * @param {Vec4} color the lines color
   */
  drawLines(mat, color) { }

  /**
   * Creates and upload vertexes data to buffer.
   * 
   * @returns {vertbuff, indibuff, numindi} buffers data
   */
  createBuffers(gl) {
    const vertbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertbuff);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexes, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const indibuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indibuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return {vertbuff, indibuff, numindi: this.numTriangles * 3, ref: this};
  }
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
   * @param {string} name the name of the shape
   * @param {list of Vec3} vertexes
   * @param {list of Vec3} triangles
   */
  constructor(name, vertexes, triangles) {
    super(
      name,
      Shape.FlattenVecArray(vertexes),
      Shape.FlattenVecArray(triangles)
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
   * @param {string} name the name of the shape
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} triangles
   */
  constructor(name, vertexes, uvs, triangles) {
    super(
      name,
      Shape.FlattenVecArrays([vertexes, uvs]),
      Shape.FlattenVecArray(triangles)
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
   * @param {string} name the name of the shape
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} normals
   * @param {list of Vec3} triangles
   */
  constructor(name, vertexes, uvs, normals, triangles) {
    super(
      name,
      Shape.FlattenVecArrays([vertexes, uvs, normals]),
      Shape.FlattenVecArray(triangles)
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
 * @class RealisticShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos, 2D-Texture-Coord, 3D-Normal, 3D-Tangent }
 * - triangles array of { indices }
 */
export class RealisticShape extends Shape {
  
  /**
   * Creates an instance of a RealisticShape.
   *
   * @param {string} name the name of the shape
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} normals
   * @param {list of Vec3} tangents
   * @param {list of Vec3} triangles
   */
  constructor(name, vertexes, uvs, normals, tangents, triangles) {
    super(
      name,
      Shape.FlattenVecArrays([vertexes, uvs, normals, tangents]),
      Shape.FlattenVecArray(triangles)
    );
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 11;
  }
}

/**
 * @class DebugShape representing a basic geometry defined by:
 * - vertexes array of { 3D-Pos, 2D-Texture-Coord, 3D-Normal, 3D-Tangent }
 * - triangles array of { indices }
 * - lines array of { indices }
 */
export class DebugShape extends Shape {
  lines;
  numLines;
  
  /**
   * Creates an instance of a DebugShape.
   *
   * @param {string} name the name of the shape
   * @param {list of Vec3} vertexes
   * @param {list of Vec2} uvs
   * @param {list of Vec3} normals
   * @param {list of Vec3} tangents
   * @param {list of Vec3} triangles
   * @param {list of Vec2} lines
   */
  constructor(name, vertexes, uvs, normals, tangents, triangles, lines) {
    super(
      name,
      Shape.FlattenVecArrays([vertexes, uvs, normals, tangents]),
      Shape.FlattenVecArray(triangles)
    );
    this.lines = new Uint16Array(Shape.FlattenVecArray(lines));
    this.numLines = this.lines.length / 2;
  }

  /**
   * Getter to retrieve data count per vertex.
   * 
   * @return {number} the vertex size
   */
  static VertexSize() {
    return 11;
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
