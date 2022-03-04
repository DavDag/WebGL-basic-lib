/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Program representing an OpenGL program
 */
export class Program {
  #gl;
  
  /**
   * Creates an instance of a Program.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   */
  constructor(gl) {
    this.#gl = gl;
    this.id = gl.createProgram();
    this.attrs = [];
  }

  /**
   * Attach a shader to the Program.
   *
   * @param {Shader} shader the shader to attach
   */
  attachShader(shader) {
    this.#gl.attachShader(this.id, shader.id);
  }

  /**
   * Link the Program. [once]
   */
  link() {
    this.#gl.linkProgram(this.id);
  }

  /**
   * Use the Program.
   */
  use() {
    this.#gl.useProgram(this.id);
  }

  /**
   * Unbind program.
   */
  static unbind(gl) {
    gl.useProgram(null);
  }

  /**
   * Bind attributes inside the Program. [once]
   *
   * @param {list of (string, number, enum, number, number)} attrs the attributes list
   */
  attributes(attrs) {
    this.attrs = attrs;
    attrs.forEach(([name, _, __, ___, ____], ind) => {
      this.#gl.bindAttribLocation(this.id, ind, name);
    });
  }

  /**
   * Enable all the attributes arrays and initialize their pointers data.
   */
  enableAttributes() {
    this.attrs.forEach(([_, count, type, size, offset], ind) => {
      this.#gl.enableVertexAttribArray(ind);
      this.#gl.vertexAttribPointer(ind, count, type, false, size, offset);
    });
  }

  /**
   * Disable all the attributes arrays.
   */
  disableAttributes() {
    this.attrs.forEach((_, ind) => {
      this.#gl.disableVertexAttribArray(ind);
    });
  }

  /**
   * Declare that a uniform exist. [once]
   *
   * @param {string} name the name of the uniform
   * @param {string} type the type of the uniform
   *
   * @return {object} a reference to the uniform obj
   */
  declareUniform(name, type) {
    const method = (id, value) => this["uniform" + type](id, value);
    const id = this.#gl.getUniformLocation(this.id, name);
    this[name] = { update: (value) => method(id, value), id };
    return this[name];
  }

  /**
   * Declare a list of uniform. [once]
   *
   * @param {list of (string, string)} uniforms the uniform list
   */
  declareUniforms(uniforms) {
    uniforms.forEach(([name, type]) => {
      this.declareUniform(name, type);
    });
  }

  /**
   * Set uniform value for the Program.
   * The Program must be in use.
   *
   * @param {number} id the uniform location
   * @param {?} value the uniform value
   */
  uniform1f(id, value) { this.#gl.uniform1f(id, value); }
  uniform1i(id, value) { this.#gl.uniform1i(id, value); }
  uniform2iv(id, value) { this.#gl.uniform2iv(id, value); }
  uniform2fv(id, value) { this.#gl.uniform2fv(id, value); }
  uniform3iv(id, value) { this.#gl.uniform3iv(id, value); }
  uniform3fv(id, value) { this.#gl.uniform3fv(id, value); }
  uniform4iv(id, value) { this.#gl.uniform4iv(id, value); }
  uniform4fv(id, value) { this.#gl.uniform4fv(id, value); }
  uniformMatrix2fv(id, value) { this.#gl.uniformMatrix2fv(id, false, value); }
  uniformMatrix3fv(id, value) { this.#gl.uniformMatrix3fv(id, false, value); }
  uniformMatrix4fv(id, value) { this.#gl.uniformMatrix4fv(id, false, value); }
}
