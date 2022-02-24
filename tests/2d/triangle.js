import * as lib from "/src/index.js";

const V_SHADER_SRC =
`
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
void main(void) {
  vColor = aColor;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const F_SHADER_SRC =
`
precision highp float;
varying vec3 vColor;
void main(void) {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

function triangle(gl) {
  const verteces = new Float32Array([
    -.8, -.6, 1, 0, 0,
      0,  .8, 0, 1, 0,
     .8, -.6, 0, 0, 1
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verteces, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);

  const vShader = new lib.Shader(gl,   gl.VERTEX_SHADER, V_SHADER_SRC);
  const fShader = new lib.Shader(gl, gl.FRAGMENT_SHADER, F_SHADER_SRC);

  const program = new lib.Program(gl);
  program.attachShader(vShader);
  program.attachShader(fShader);
  program.attributes([(0, "aPosition"), (1, "aColor")]);
  program.link();
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  program.use();
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function main() {
  try {
    const gl = lib.RetrieveWebGLContext("main-canvas");
    triangle(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
