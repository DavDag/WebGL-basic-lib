/** @author: Davide Risaliti davdag24@gmail.com */

import { Program, Shader, Sphere, Vec3, Vec4, Mat4, RealisticShape, Texture, TexturedShape, toRad } from "webgl-basic-lib";

const COL_TEXTURE_CONFIGS = (gl) => { return {
  target: gl.TEXTURE_2D,
  level: 0,
  format: gl.RGBA,
  type: gl.UNSIGNED_BYTE,
  wrap: gl.CLAMP_TO_EDGE,
  filter: gl.LINEAR,
  genMipMap: true,
}};

const V_SHADER_SRC =
`
attribute vec3 aPos;
attribute vec2 aTex;
uniform mat4 uMatrix;
varying vec2 vTex;
void main(void) {
  vTex = aTex;
  gl_Position = uMatrix * vec4(aPos, 1.0);
}
`;

const F_SHADER_SRC =
`
precision highp float;
uniform sampler2D uTexDay;
varying vec2 vTex;
void main(void) {
  vec3 texCol = texture2D(uTexDay, vTex).rgb;
  gl_FragColor = vec4(texCol * 20.0, 1.0);
}
`;

export class Sun {
  ctx=null;
  isHR=null;
  texBasePath=null;
  texUrl=function(name){return`/${this.texBasePath}/sun/${((this.isHR) ? "8k" : "2k")}/${name}`;};

  program=null;
  buffers={
    vertbuff:null,
    indibuff:null,
    numindi:null,
    rawShape:null,
  };
  textures={
    DAY:null,
  };
  mat=null;

  constructor(gl, isHR, texBasePath) {
    this.ctx = gl;
    this.isHR = isHR;
    this.texBasePath = texBasePath;
  }

  get position() {
    return new Vec4(0, 0, 0, 1).transform(this.mat).toVec3();
  }

  async setup() {
    console.log("Creating Sun...");
    const gl = this.ctx;
    // ============ SHADER PROGRAM ================
    this.program = new Program(gl);
    this.program.attachShader(new Shader(gl, gl.VERTEX_SHADER, V_SHADER_SRC));
    this.program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, F_SHADER_SRC));
    this.program.attributes([
      ["aPos", 3, gl.FLOAT, 4 * TexturedShape.VertexSize(),  0],
      ["aTex", 2, gl.FLOAT, 4 * TexturedShape.VertexSize(), 12],
    ]);
    this.program.link();
    this.program.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uTexDay", "1i"],
    ]);
    this.program.use();
    this.program.uTexDay.update(0);
    this.program.unbind();
    // ============ GL BUFFERS ================
    const rawShape = Sphere.asTexturedShape(32, 32);
    this.buffers.vertbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertbuff);
    gl.bufferData(gl.ARRAY_BUFFER, rawShape.vertexes, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.buffers.indibuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indibuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rawShape.triangles, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.buffers.numindi = rawShape.numTriangles * 3;
    this.buffers.rawShape = rawShape;
    // ============ MATRIX ================
    this.mat = Mat4.Identity();
    // ============ GL TEXTURES ================
    await Promise.allSettled([
      Texture
        .FromUrl(gl, this.texUrl("day.jpg"), COL_TEXTURE_CONFIGS(gl))
        .then((tex) => this.textures.DAY=tex),
    ]);
    // =========================================
    // console.log(this);
  }

  timePassed=0;
  update(dt) {
    const gl = this.ctx;
    this.timePassed += dt;
    this.mat = Mat4.Identity()
      .rotate(toRad(10 * this.timePassed), new Vec3(0, 1, 0))
      .translate(new Vec3(-30, 0, 0))
      .scale(Vec3.All(25))
    ;
  }

  draw(stack, cameraPos) {
    const gl = this.ctx;
    // ============ PRE-SETUP ================
    // Push Matrix into the stack
    const curr = stack.push(this.mat);
    const model = this.mat;
    // ============ BIND & PREPARE ================
    this.program.use();
    this.textures.DAY.bind(0);
    this.program.uMatrix.update(curr.values);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertbuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indibuff);
    this.program.enableAttributes();
    // ============ DRAW CALL ================
    gl.drawElements(gl.TRIANGLES, this.buffers.numindi, gl.UNSIGNED_SHORT, 0);
    // ============ RELEASE & UNBIND ================
    this.program.disableAttributes();
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    Object.values(this.textures)
      .forEach((tex) => tex.unbind());
    this.program.unbind();
    // ==============================================
    // Pop planet's matrix
    stack.pop();
  }
}
