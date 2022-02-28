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
  gl_PointSize = 10.0;
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

function cube(gl) {
  const verteces = new Float32Array([
    // front face
     1.0,  1.0,  1.0,    1, 0, 0,
    -1.0,  1.0,  1.0,    1, 0, 0,
    -1.0, -1.0,  1.0,    1, 0, 0,
     1.0, -1.0,  1.0,    1, 0, 0,
    // back face
     1.0,  1.0, -1.0,    0, 0, 1,
    -1.0,  1.0, -1.0,    0, 0, 1,
    -1.0, -1.0, -1.0,    0, 0, 1,
     1.0, -1.0, -1.0,    0, 0, 1,
    // top face
     1.0,  1.0,  1.0,    1, 0, 1,
    -1.0,  1.0,  1.0,    1, 0, 1,
    -1.0,  1.0, -1.0,    1, 0, 1,
     1.0,  1.0, -1.0,    1, 0, 1,
    // bot face
     1.0, -1.0,  1.0,    0, 1, 1,
    -1.0, -1.0,  1.0,    0, 1, 1,
    -1.0, -1.0, -1.0,    0, 1, 1,
     1.0, -1.0, -1.0,    0, 1, 1,
    // left face
    -1.0,  1.0,  1.0,    0, 1, 0,
    -1.0, -1.0,  1.0,    0, 1, 0,
    -1.0, -1.0, -1.0,    0, 1, 0,
    -1.0,  1.0, -1.0,    0, 1, 0,
    // right face
     1.0,  1.0,  1.0,    1, 1, 0,
     1.0, -1.0,  1.0,    1, 1, 0,
     1.0, -1.0, -1.0,    1, 1, 0,
     1.0,  1.0, -1.0,    1, 1, 0,
  ]);

  const elements = new Uint8Array([    
		 0,  1,  2,  0,  2,  3, // face #1
		 4,  5,  6,  4,  6,  7, // face #2
		 8,  9, 10,  8, 10, 11, // face #3
		12, 13, 14, 12, 14, 15, // face #4
		16, 17, 18, 16, 18, 19, // face #5
		20, 21, 22, 20, 22, 23  // face #6
  ]);

  const vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verteces, gl.STATIC_DRAW);

  const element_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, element_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);

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

  var time = 0;
  const draw = () => {
    time += 1;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    program.use();

    const axe = new lib.Vec3(Math.cos(time / 50), Math.sin(time / 50), 0).normalize();
    const tmpViewMat = viewMat.clone()
      .rotate(lib.toRad(time), axe)
      .transpose();
    
    gl.uniformMatrix4fv(projMatLoc, false, projMat.values);
    gl.uniformMatrix4fv(viewMatLoc, false, tmpViewMat.values);
    
    gl.drawElements(gl.TRIANGLES, elements.length, gl.UNSIGNED_BYTE, 0);
  };

  setInterval(draw, 16);
}

function main() {
  try {
    const gl = lib.RetrieveWebGLContext("main-canvas");
    cube(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
