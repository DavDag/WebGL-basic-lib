import {Shader, Program} from "webgl-basic-lib";

const VSOURCE1 = 
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

const FSOURCE1 = 
`
precision mediump float;
uniform float uSize;
uniform sampler2D uTexture;
varying vec2 vTex;
void main() {
  int x = int(floor(vTex.x * uSize));
  int y = int(floor(vTex.y * uSize));
  vec2 coord = vec2(x, y) / uSize;
  vec4 col = texture2D(uTexture, coord);

  float total = 0.0;
  for (int dx = -1; dx <= 1; dx += 1) {
    if ((x + dx) >= int(uSize) || (x + dx) < 0) continue;
    for (int dy = -1; dy <= 1; dy += 1) {
      if ((y + dy) >= int(uSize) || (y + dy) < 0) continue;
      vec4 neighbor = texture2D(uTexture, coord + vec2(dx, dy) / uSize);
      if (neighbor.r == 1.0) {
        total += 1.0;
      }
    }
  }

  vec4 alive = vec4(1, 1, 1, 1);
  vec4 dead = vec4(0, 0, 0, 1);

  // Live cell
  if (col.r == 1.0) {
    total -= 1.0;

    // Underpopulation cap
    if (total == 2.0) {
      gl_FragColor = alive;
    }
    // Keep alive
    else if (total == 3.0) {
      gl_FragColor = alive;
    }
    // Overpopulation
    else {
      gl_FragColor = dead;
    }
  } else {
    // Reproduction
    if (total == 3.0) {
      gl_FragColor = alive;
    }
    // Remain dead
    else {
      gl_FragColor = dead;
    } 
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
