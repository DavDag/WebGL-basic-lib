import * as lib from "/src/all.js";

const V_SHADER_SRC =
`
attribute vec4 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main(void) {
  vColor = aColor;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
}
`;

const F_SHADER_SRC =
`
precision highp float;
varying vec3 vColor;
void main(void) {
  gl_FragColor = vec4(vColor, 1);
}
`;

function quad(gl) {
  const verteces = new Float32Array([
    +1, +1, -1,   1, 0, 0,
    -1, +1, -1,   0, 1, 0,
    +1, -1, -1,   0, 0, 1,
    -1, -1, -1,   1, 1, 1,
    -1, -1, +1,   1, 0, 0,
    -1, +1, -1,   0, 1, 0,
    -1, +1, +1,   0, 0, 1,
    +1, +1, -1,   1, 1, 1,
    +1, +1, +1,   1, 0, 0,
    +1, -1, -1,   0, 1, 0,
    +1, -1, +1,   0, 0, 1,
    -1, -1, +1,   1, 1, 1,
    +1, +1, +1,   1, 0, 0,
    -1, +1, +1,   0, 1, 0
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verteces, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24,  0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);

  const vShader = new lib.Shader(gl,   gl.VERTEX_SHADER, V_SHADER_SRC);
  const fShader = new lib.Shader(gl, gl.FRAGMENT_SHADER, F_SHADER_SRC);

  const program = new lib.Program(gl);
  program.attachShader(vShader);
  program.attachShader(fShader);
  program.attributes([(0, "aPosition"), (1, "aColor")]);
  program.link();

  const projMatLoc = gl.getUniformLocation(program.id, "uProjectionMatrix");
  const viewMatLoc = gl.getUniformLocation(program.id, "uModelViewMatrix");

  const projMat = lib.Mat4.Perspective(lib.toRad(45), 1, 0.1, 100.0).transpose();
  const viewMat = lib.Mat4.Identity().translate(new lib.Vec3(0, 0, -6));

  // const res = projMat.clone().apply(viewMat);
  // console.log(res.toString(2));

  var time = 0;
  const draw = () => {
    time += 1;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    program.use();

    const axe = new lib.Vec3(1, 1, 0).normalize();
    const tmpViewMat = viewMat.clone()
      .rotate(lib.toRad(time), axe)
      .transpose();
    
    gl.uniformMatrix4fv(projMatLoc, false, projMat.values);
    gl.uniformMatrix4fv(viewMatLoc, false, tmpViewMat.values);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 14);
  };

  setInterval(draw, 8);
}

function main() {
  try {
    const gl = lib.RetrieveWebGLContext("main-canvas");
    quad(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
