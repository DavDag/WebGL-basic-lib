export class Program {
  //
  constructor(gl) {
    this.gl = gl;
    this.id = gl.createProgram();
  }

  // 
  attachShader(shader) {
    this.gl.attachShader(this.id, shader.id);
  }

  link() {
    this.gl.linkProgram(this.id);
  }

  use() {
    this.gl.useProgram(this.id);
  }

  // 
  attributes(attrs) {
    attrs.forEach((ind, name) => {
      this.gl.bindAttribLocation(this.id, ind, name);      
    });
  }

  uniform1f(uniformId, uniformValue) {
    this.gl.uniform1f(uniformId, uniformValue);
  }
}
