/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Shader representing an OpenGL shader
 */
export class Shader {
  #gl;
  
  /**
   * Creates an instance of a Shader.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {gl.ENUM_TYPE} type the Shader type
   * @param {string} src the Shader source
   */
  constructor(gl, type, src) {
    this.#gl = gl;
    this.id = null;
    this.src = src;
    this.type = type;
    this.#compileShader();
  }

  /**
   * Compiles the Shader.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {gl.ENUM_TYPE} type the Shader type
   * @param {string} src the Shader source
   *
   * @throws an Error when the Shader does not compile successfully
   */
  #compileShader() {
    // Create shader object
    const shader = this.#gl.createShader(this.type);

    // Set source code
    this.#gl.shaderSource(shader, this.src);
  
    // Compile shader
    this.#gl.compileShader(shader);

    // Check compilation results
    const status = this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS);
    const log    = this.#gl.getShaderInfoLog(shader);

    // Validate shader
    if (status === this.#gl.GL_FALSE || log != "") throw new Error("{SHADER-ERROR}: " + log);
  
    // Result
    this.id = shader;
  }
}
