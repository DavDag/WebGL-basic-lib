/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Program representing an OpenGL program
 */
export class Program {
  /**
   * Creates an instance of a Program.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   */
  constructor(gl) {
    this.gl = gl;
    this.id = gl.createProgram();
  }

  /**
   * Attach a shader to the Program.
   *
   * @param {Shader} shader the shader to attach
   */
  attachShader(shader) {
    this.gl.attachShader(this.id, shader.id);
  }

  /**
   * Link the Program. [once]
   */
  link() {
    this.gl.linkProgram(this.id);
  }

  /**
   * Use the Program.
   */
  use() {
    this.gl.useProgram(this.id);
  }

  /**
   * Bind attributes inside the Program. [once]
   *
   * @param {(number, string)[]} attrs the attributes list
   */
  attributes(attrs) {
    attrs.forEach((ind, name) => {
      this.gl.bindAttribLocation(this.id, ind, name);      
    });
  }

  /**
   * Set uniform value for the Program.
   * The Program must be in use.
   *
   * @param {number} uniformId the uniform location
   * @param {any} uniformValue the uniform value
   */
  uniform1f(uniformId, uniformValue) {
    this.gl.uniform1f(uniformId, uniformValue);
  }
}
