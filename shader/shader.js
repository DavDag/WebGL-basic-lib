export class Shader {
  // 
  constructor(gl, shaderType, shaderSrc) {
    this.gl   = gl;
    this.id   = Shader.CompileShader(gl, shaderType, shaderSrc);
    this.src  = shaderSrc;
    this.type = shaderType;
  }

  //
  static CompileShader(gl, shaderType, shaderSrc) {
    // Create shader object
    const shader = gl.createShader(shaderType);

    // Set source code
    gl.shaderSource(shader, shaderSrc);
  
    // Compile shader
    gl.compileShader(shader);

    // Check compilation results
    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    const log    = gl.getShaderInfoLog(shader);

    // Validate shader
    if (status === gl.GL_FALSE || log != "") throw new Error("{SHADER-ERROR}: " + log);
  
    // Result
    return shader;
  }
}
