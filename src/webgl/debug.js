/** @author: Davide Risaliti davdag24@gmail.com */

import {Shader} from "./shader.js";
import {Program} from "./program.js";

const POINTS_VERT_SHADER =
`
attribute vec4 aPosition;
uniform mat4 uMatrix;
uniform float uPointSize;
void main(void) {
  gl_Position = uMatrix * aPosition;
  gl_PointSize = uPointSize;
}
`;

const POINTS_FRAG_SHADER =
`
precision highp float;
uniform vec4 uPointColor;
void main(void) {
  gl_FragColor = uPointColor;
}
`;

const LINES_VERT_SHADER =
`
attribute vec4 aPosition;
uniform mat4 uMatrix;
void main(void) {
  gl_Position = uMatrix * aPosition;
}
`;

const LINES_FRAG_SHADER =
`
precision highp float;
uniform vec4 uLineColor;
void main(void) {
  gl_FragColor = uLineColor;
}
`;

/**
 * @class Debug wrapping some utilities to debug.
 */
export class Debug {
  static #gl;
  static #arrayBuffer;
  static #indexBuffer;
  static #pointsProgram;
  static #linesProgram;
  
  /**
   * Initialize the Debug data.
   *
   * @param {WebGLRenderingContext} gl the webgl context
   */
  static Initialize(gl) {
    Debug.#gl = gl;

    // Create buffers
    Debug.#arrayBuffer = gl.createBuffer();
    Debug.#indexBuffer = gl.createBuffer();

    // Debug programs: Points
    Debug.#pointsProgram = new Program(gl);
    Debug.#pointsProgram.attachShader(new Shader(gl, gl.VERTEX_SHADER, POINTS_VERT_SHADER));
    Debug.#pointsProgram.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, POINTS_FRAG_SHADER));
    Debug.#pointsProgram.attributes([[0, "aPosition"]]);
    Debug.#pointsProgram.link();
    Debug.#pointsProgram.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uPointSize", "1f"],
      ["uPointColor", "4fv"]
    ]);
    
    // Debug programs: Lines
    Debug.#linesProgram = new Program(gl);
    Debug.#linesProgram.attachShader(new Shader(gl, gl.VERTEX_SHADER, LINES_VERT_SHADER));
    Debug.#linesProgram.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, LINES_FRAG_SHADER));
    Debug.#linesProgram.attributes([[0, "aPosition"]]);
    Debug.#linesProgram.link();
    Debug.#linesProgram.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uLineColor", "4fv"]
    ]);
  }

  /**
   * Draw points with size and color.
   *
   * @param {Float32Array} verteces the verteces data
   * @param {number} vertexSize the size of a vertex
   * @param {Mat4} mat the transformation data
   * @param {number} numPoints the points count
   * @param {Vec4} color the color to use when drawing points
   * @param {number} size the size of a point
   */
  static drawPoints(verteces, vertexSize, mat, numPoints, color, size) {
    // Buffers setup
    Debug.#gl.bindBuffer(Debug.#gl.ARRAY_BUFFER, Debug.#arrayBuffer);
    Debug.#gl.bufferData(Debug.#gl.ARRAY_BUFFER, verteces, Debug.#gl.DYNAMIC_DRAW);
    Debug.#gl.enableVertexAttribArray(0);
    Debug.#gl.vertexAttribPointer(0, 3, Debug.#gl.FLOAT, false, 4 * vertexSize,  0);
    
    // Program setup
    Debug.#pointsProgram.use();
    Debug.#pointsProgram.uMatrix.update(mat.values);
    Debug.#pointsProgram.uPointColor.update(color.values);
    Debug.#pointsProgram.uPointSize.update(size);

    // Draw
    Debug.#gl.drawArrays(Debug.#gl.POINTS, 0, numPoints);
    
    // End draw
    Debug.#gl.disableVertexAttribArray(0);
    Program.unbind(Debug.#gl);
    Debug.#gl.bindBuffer(Debug.#gl.ARRAY_BUFFER, null);
  }

  /**
   * Draw lines with size and color.
   *
   * @param {Float32Array} verteces the verteces data
   * @param {Uint16Array} indices the elements data
   * @param {number} vertexSize the size of a vertex
   * @param {Mat4} mat the transformation data
   * @param {number} numLines the lines count
   * @param {Vec4} color the color to use when drawing lines
   */
  static drawLines(verteces, indices, vertexSize, mat, numLines, color) {
    // Buffers setup
    Debug.#gl.bindBuffer(Debug.#gl.ARRAY_BUFFER, Debug.#arrayBuffer);
    Debug.#gl.bufferData(Debug.#gl.ARRAY_BUFFER, verteces, Debug.#gl.DYNAMIC_DRAW);
    Debug.#gl.bindBuffer(Debug.#gl.ELEMENT_ARRAY_BUFFER, Debug.#indexBuffer);
    Debug.#gl.bufferData(Debug.#gl.ELEMENT_ARRAY_BUFFER, indices, Debug.#gl.DYNAMIC_DRAW);
    Debug.#gl.enableVertexAttribArray(0);
    Debug.#gl.vertexAttribPointer(0, 3, Debug.#gl.FLOAT, false, 4 * vertexSize,  0);
    
    // Program setup
    Debug.#linesProgram.use();
    Debug.#linesProgram.uMatrix.update(mat.values);
    Debug.#linesProgram.uLineColor.update(color.values);

    // Draw
    Debug.#gl.drawElements(Debug.#gl.LINES, numLines * 2, Debug.#gl.UNSIGNED_SHORT, 0);
    
    // End draw
    Debug.#gl.disableVertexAttribArray(0);
    Program.unbind(Debug.#gl);
    Debug.#gl.bindBuffer(Debug.#gl.ARRAY_BUFFER, null);
    Debug.#gl.bindBuffer(Debug.#gl.ELEMENT_ARRAY_BUFFER, null);
  }
}
