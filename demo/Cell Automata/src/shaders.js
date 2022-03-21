import {Shader, Program} from "webgl-basic-lib";

const VSOURCE1 = 
`
precision mediump float;
attribute vec2 aPos;
attribute vec2 aTex;
uniform float uSize;
varying vec2 vTex;
void main() {
  vTex = aTex;
  gl_Position = vec4(aPos, 0, 1);
}
`;

const FSOURCE1 = 
`
precision mediump float;
uniform float uSize;
uniform sampler2D uTexture;
varying vec2 vTex;
void main() {
  int x = int(floor(vTex.x * uSize));
  int y = int(floor(vTex.y * uSize + 0.5));
  vec2 coord = vec2(x, y) / uSize;
  vec4 col = texture2D(uTexture, coord);

  float total = 0.0;
  for (int dx = -1; dx <= 1; dx += 1) {
    for (int dy = -1; dy <= 1; dy += 1) {
      total += texture2D(uTexture, coord + vec2(dx, dy) / uSize).r;
    }
  }

  gl_FragColor = vec4(0, 0, 0, 1);
  if (total == 3.0 || total == 4.0) {
    gl_FragColor = vec4(1, 1, 1, 1);
  }
}
`;

const VSOURCE2 = 
`
precision mediump float;
attribute vec2 aPos;
attribute vec2 aTex;
uniform mat4 uMatrix;
uniform float uSize;
varying vec2 vTex;
void main() {
  vTex = aTex;
  gl_Position = uMatrix * vec4(aPos, 0, 1);
}
`;

const FSOURCE2 = 
`
precision mediump float;
uniform float uSize;
uniform sampler2D uTexture;
varying vec2 vTex;
void main() {
  gl_FragColor = texture2D(uTexture, vTex);
}
`;

export function programs(gl) {
  const vshader1 = new Shader(gl, gl.VERTEX_SHADER, VSOURCE1);
  const fshader1 = new Shader(gl, gl.FRAGMENT_SHADER, FSOURCE1);

  const program1 = new Program(gl);
  program1.attachShader(vshader1);
  program1.attachShader(fshader1);
  program1.link();

  const vshader2 = new Shader(gl, gl.VERTEX_SHADER, VSOURCE2);
  const fshader2 = new Shader(gl, gl.FRAGMENT_SHADER, FSOURCE2);

  const program2 = new Program(gl);
  program2.attachShader(vshader2);
  program2.attachShader(fshader2);
  program2.link();

  return [program1, program2];
}
