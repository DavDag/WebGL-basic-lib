/** @author: Davide Risaliti davdag24@gmail.com */

import { Program, Shader, Sphere, Vec3, Vec4, Mat4, RealisticShape, Texture, toRad, toDeg, Colors } from "webgl-basic-lib";

const COL_TEXTURE_CONFIGS = (gl) => { return {
  target: gl.TEXTURE_2D,
  level: 0,
  format: gl.ext.EXT_sRGB.SRGB_ALPHA_EXT,
  type: gl.UNSIGNED_BYTE,
  wrap: gl.CLAMP_TO_EDGE,
  filter: gl.LINEAR,
  genMipMap: false,
}};

const NORM_TEXTURE_CONFIGS = (gl) => { return {
  target: gl.TEXTURE_2D,
  level: 0,
  format: gl.RGB,
  type: gl.UNSIGNED_BYTE,
  wrap: gl.CLAMP_TO_EDGE,
  filter: gl.LINEAR,
  genMipMap: false,
}};

const SPEC_TEXTURE_CONFIGS = (gl) => { return {
  target: gl.TEXTURE_2D,
  level: 0,
  format: gl.RGB,
  type: gl.UNSIGNED_BYTE,
  wrap: gl.CLAMP_TO_EDGE,
  filter: gl.LINEAR,
  genMipMap: false,
}};

const V_SHADER_SRC =
`
attribute vec3 aPos;
attribute vec2 aTex;
attribute vec3 aNor;
attribute vec3 aTan;
uniform mat4 uMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uInvTraModelMatrix;
uniform vec3 uCameraPos;
uniform vec3 uSunPos;
varying vec3 vPos;
varying vec2 vTex;
varying vec3 vNor;
varying vec3 vTan;
varying vec3 vCameraPos;
varying vec3 vSunPos;
mat3 transpose(mat3 src) {
  return mat3(
    vec3(src[0].x, src[1].x, src[2].x),
    vec3(src[0].y, src[1].y, src[2].y),
    vec3(src[0].z, src[1].z, src[2].z)
  );
}
void main(void) {
  vPos = vec3(uModelMatrix * vec4(aPos, 1.0));
  vTex = aTex;
  mat3 normalMatrix = mat3(uInvTraModelMatrix);
  vec3 T = normalize(normalMatrix * aTan);
  vec3 N = normalize(normalMatrix * aNor);
  T = normalize(T - dot(T, N) * N);
  vec3 B = cross(N, T);
  
  mat3 TBN = transpose(mat3(T, B, N));
  vPos = TBN * vPos;
  vNor = TBN * N;
  vSunPos = TBN * uSunPos;
  vCameraPos = TBN * uCameraPos;

  gl_Position = uMatrix * vec4(aPos, 1.0);
}
`;

const F_SHADER_SRC =
`
precision highp float;
uniform sampler2D uTexDay;
uniform sampler2D uTexNight;
uniform sampler2D uTexNorm;
uniform sampler2D uTexSpec;
uniform float uUseBlinn;
uniform float uShininess;
uniform float uAmbFac;
uniform float uDifFac;
uniform float uSpeFac;
uniform vec3 uLightColor;
varying vec3 vPos;
varying vec2 vTex;
varying vec3 vNor;
varying vec3 vTan;
varying vec3 vCameraPos;
varying vec3 vSunPos;

vec4 CalcLight(vec3 N, vec2 uv, vec3 S) {
  vec3 texColD = texture2D(uTexDay, uv).rgb;
  vec3 texColN = texture2D(uTexNight, uv).rgb;

  // Diffuse term
  vec3 lightDir = normalize(vSunPos - vPos);
  float diffuse = dot(lightDir, N);

  if (diffuse <= 0.0) {
    float bright = dot(texColN, vec3(0.2126, 0.7152, 0.0722));
    float mod = bright;
    mod = (mod > 0.5) ? 1.5 : 1.0;
    return vec4(texColN * mod, 1.0);
  }

  diffuse = max(diffuse, 0.0);
  
  // Specular term
  vec3 viewDir = normalize(vCameraPos - vPos);
  float specular;
  if (uUseBlinn == 0.0) {
    vec3 reflectDir = reflect(-lightDir, N);
    specular = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
  } else {
    vec3 halfwayDir = normalize(lightDir + viewDir);
    specular = pow(max(dot(N, halfwayDir), 0.0), uShininess);;
  }

  if (diffuse <= 0.0) specular = 0.0;

  // Combine
  vec3 amb = uAmbFac * texColD;
  vec3 dif = uDifFac * texColD * diffuse;
  vec3 spe = uSpeFac * texColD * S * specular;

  vec3 res = (amb + dif + spe) * uLightColor;

  return vec4(res, 1.0);
}

void main(void) {
  vec3 texNor = texture2D(uTexNorm, vTex).rgb;
  vec3 texSpe = texture2D(uTexSpec, vTex).rgb;
  vec3 N = normalize(texNor * 2.0 - 1.0);

  gl_FragColor = CalcLight(N, vTex, texSpe);
}
`;


export class Earth {
  ctx=null;
  isHR=null;
  texBasePath=null;
  texUrl=function(name){return`/${this.texBasePath}/earth/${((this.isHR) ? "8k" : "2k")}/${name}`;};

  program=null;
  buffers={
    vertbuff:null,
    indibuff:null,
    numindi:null,
    ref:null,
  };
  textures={
    DAY:null,
    NIGHT:null,
    NORM:null,
    SPEC:null,
  };
  mat=null;

  constructor(gl, isHR, texBasePath) {
    this.ctx = gl;
    this.isHR = isHR;
    this.texBasePath = texBasePath;
  }

  async setup() {
    console.log("Creating Earth...");
    const gl = this.ctx;
    // ============ SHADER PROGRAM ================
    this.program = new Program(gl);
    this.program.attachShader(new Shader(gl, gl.VERTEX_SHADER, V_SHADER_SRC));
    this.program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, F_SHADER_SRC));
    this.program.attributes([
      ["aPos", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(),  0],
      ["aTex", 2, gl.FLOAT, 4 * RealisticShape.VertexSize(), 12],
      ["aNor", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(), 20],
      ["aTan", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(), 32],
    ]);
    this.program.link();
    this.program.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uModelMatrix", "Matrix4fv"],
      ["uInvTraModelMatrix", "Matrix4fv"],
      ["uTexDay", "1i"],
      ["uTexNight", "1i"],
      ["uTexNorm", "1i"],
      ["uTexSpec", "1i"],
      ["uUseBlinn", "1f"],
      ["uShininess", "1f"],
      ["uAmbFac", "1f"],
      ["uDifFac", "1f"],
      ["uSpeFac", "1f"],
      ["uLightColor", "3fv"],
      ["uCameraPos", "3fv"],
      ["uSunPos", "3fv"],
    ]);
    this.program.use();
    this.program.uTexDay.update(0);
    this.program.uTexNight.update(1);
    this.program.uTexNorm.update(2);
    this.program.uTexSpec.update(3);
    this.program.unbind();
    // ============ GL BUFFERS ================
    const sphere = Sphere.asDebugShape(64, 64).createBuffers(gl);  
    this.buffers = sphere;
    // ============ MATRIX ================
    this.mat = Mat4.Identity()
      .translate(new Vec3(0, 0, 0))
      .scale(new Vec3(5, 5, 5))
    ;
    // ============ GL TEXTURES ================
    await Promise.allSettled([
      Texture
        .FromUrl(gl, this.texUrl("day.jpg"), COL_TEXTURE_CONFIGS(gl))
        .then((tex) => this.textures.DAY=tex),
      Texture
        .FromUrl(gl, this.texUrl("night.jpg"), COL_TEXTURE_CONFIGS(gl))
        .then((tex) => this.textures.NIGHT=tex),
      Texture
        .FromUrl(gl, this.texUrl("normal.png"), NORM_TEXTURE_CONFIGS(gl))
        .then((tex) => this.textures.NORM=tex),
      Texture
        .FromUrl(gl, this.texUrl("specular.png"), SPEC_TEXTURE_CONFIGS(gl))
        .then((tex) => this.textures.SPEC=tex),
    ]);
    // =========================================
    // console.log(this);
  }

  update(dt) {
    const gl = this.ctx;
  }

  draw(stack, cameraPos, sunPos, useBlinn, lightColor, {amb, dif, spe}, shininess) {
    const gl = this.ctx;
    // ============ PRE-SETUP ================
    // Push Matrix into the stack
    const curr = stack.push(this.mat);
    const model = this.mat;
    // ============ BIND & PREPARE ================
    this.program.use();
    this.textures.DAY.bind(0);
    this.textures.NIGHT.bind(1);
    this.textures.NORM.bind(2);
    this.textures.SPEC.bind(3);
    this.program.uUseBlinn.update(+useBlinn);
    this.program.uLightColor.update(lightColor.values);
    this.program.uAmbFac.update(amb);
    this.program.uDifFac.update(dif);
    this.program.uSpeFac.update(spe);
    this.program.uShininess.update(shininess);
    this.program.uSunPos.update(sunPos.values);
    this.program.uCameraPos.update(cameraPos.values);
    this.program.uMatrix.update(curr.values);
    this.program.uModelMatrix.update(model.values);
    this.program.uInvTraModelMatrix.update(model.clone().inverse().transpose().values);
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
    // this.buffers.rawShape.drawPoints(curr, Colors.White.toVec4(1.0), 5);
    // this.buffers.rawShape.drawLines(curr, Colors.Yellow.toVec4(1.0));
    // ==============================================
    // Pop planet's matrix
    stack.pop();
  }
}
