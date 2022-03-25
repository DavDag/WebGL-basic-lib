import {Shader, Program, Texture, Debug, Sphere, Mat4, toRad, Vec3, Vec4, MatrixStack, Camera, Icosahedron, RealisticShape } from "webgl-basic-lib";

const PLANETS_ROT_SPEED = 0.25;

const IS_HR = false;
const DELTA_T = 1 / 60;
const texUrl = (planet, name, isHR) => `/assets/${planet}/${((isHR) ? "8k" : "2k")}/${name}`;

const SIMPLE = 0;
const DIFFUSED = 1;
const ADVANCED = 2;

export class Universe {
  ctx=null;
  programs={
    planets:null,
  };
  planets={
    earth:null,
    sun:null,
  };
  stack=null;
  modelStack=null;
  camera=null;

  static COL_TEXTURE_CONFIGS = (gl) => { return {
    target: gl.TEXTURE_2D,
    level: 0,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    wrap: gl.CLAMP_TO_EDGE,
    filter: gl.LINEAR,
    genMipMap: true,
  }};

  static NORM_TEXTURE_CONFIGS = (gl) => { return {
    target: gl.TEXTURE_2D,
    level: 0,
    format: gl.RGB,
    type: gl.UNSIGNED_BYTE,
    wrap: gl.CLAMP_TO_EDGE,
    filter: gl.LINEAR,
    genMipMap: true,
  }};

  static SPEC_TEXTURE_CONFIGS = (gl) => { return {
    target: gl.TEXTURE_2D,
    level: 0,
    format: gl.RGB,
    type: gl.UNSIGNED_BYTE,
    wrap: gl.CLAMP_TO_EDGE,
    filter: gl.LINEAR,
    genMipMap: true,
  }};

  static V_SHADER_SRC =
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

  static F_SHADER_SRC =
  `
  precision highp float;
  uniform float uDrawMode;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform sampler2D uTextureN;
  uniform sampler2D uTextureS;
  varying vec3 vPos;
  varying vec2 vTex;
  varying vec3 vNor;
  varying vec3 vTan;
  varying vec3 vCameraPos;
  varying vec3 vSunPos;
  vec3 CalcLight(vec3 normal, vec3 color, vec3 specular) {
    vec3 amb = 0.05 * color;

    vec3 lightDir = normalize(vSunPos - vPos);
    vec3 dif = 0.80 * color * max(dot(lightDir, normal), 0.0);

    vec3 viewDir = normalize(vCameraPos - vPos);
    // vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // vec3 spe = 1.00 * specular * pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 spe = 1.00 * specular * color * pow(max(dot(normal, halfwayDir), 0.0), 2.0);

    return (amb + dif + spe);
  }
  void main(void) {
    vec3 texCol = texture2D(uTexture1, vTex).rgb;
    vec3 texSpe = texture2D(uTextureS, vTex).rgb;
    if (uDrawMode == 0.0) {
      gl_FragColor = texture2D(uTexture1, vTex);
    }
    else if (uDrawMode == 1.0) {
      vec3 norm = normalize(vNor);
      gl_FragColor = vec4(CalcLight(norm, texCol, vec3(0)), 1.0);
    }
    else if (uDrawMode == 2.0) {
      vec3 normal = texture2D(uTextureN, vTex).rgb;
      normal = normalize(normal);
      gl_FragColor = vec4(CalcLight(normal, texCol, texSpe), 1.0);
    }
    else {
      gl_FragColor = vec4(1.0);
    }
  }
  `;

  OnResize(canvasSize, contextSize) {
    const gl = this.ctx;
    gl.canvasEl.width  = canvasSize.w;
    gl.canvasEl.height = canvasSize.h;
    gl.canvas.width    = contextSize.w;
    gl.canvas.height   = contextSize.h;
    gl.viewport(0, 0, contextSize.w, contextSize.h);
    const factor = contextSize.w / contextSize.h;
    // Update camera's perspective matrix
    this.camera.ratio = factor;
  }

  async #setup() {
    const gl = this.ctx;
    // MatrixStack and Camera
    this.stack = new MatrixStack();
    this.modelStack = new MatrixStack();
    this.camera = new Camera(45, 1.0, 1, 10000, new Vec3(0, 25, -50), new Vec3(0, 0, 0), new Vec3(0, 1, 0), true);
    // this.camera = new Camera(45, 1.0, 1, 10000, new Vec3(0, 3, -10), new Vec3(0, 0, 0), new Vec3(0, 1, 0), true);
    // Planets program
    const program = new Program(gl);
    program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Universe.V_SHADER_SRC));
    program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Universe.F_SHADER_SRC));
    program.attributes([
      ["aPos", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(),  0],
      ["aTex", 2, gl.FLOAT, 4 * RealisticShape.VertexSize(), 12],
      ["aNor", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(), 20],
      ["aTan", 3, gl.FLOAT, 4 * RealisticShape.VertexSize(), 32],
    ]);
    program.link();
    program.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uModelMatrix", "Matrix4fv"],
      ["uInvTraModelMatrix", "Matrix4fv"],
      ["uTexture1", "1i"],
      ["uTexture2", "1i"],
      ["uTextureN", "1i"],
      ["uTextureS", "1i"],
      ["uDrawMode", "1f"],
      ["uCameraPos", "3fv"],
      ["uSunPos", "3fv"],
    ]);
    this.programs.planets = program;
    // Planets
    const rawShape = Sphere.asRealisticShape(64, 64);  
    const vertbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertbuff);
    gl.bufferData(gl.ARRAY_BUFFER, rawShape.vertexes, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const elembuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elembuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rawShape.triangles, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Sun
    this.planets.sun = {
      vertbuff, elembuffer, numindi: rawShape.triangles.length,
      ref: rawShape, drawMode: SIMPLE,
      texture1: await Texture.FromUrl(gl, texUrl("sun", "day.jpg", IS_HR), Universe.COL_TEXTURE_CONFIGS(gl)),
      mat: Mat4.Identity(),
      timePassed: 0,
      update: function(dt) {
        this.timePassed += dt;
        this.mat = Mat4.Identity()
          .rotate(toRad(15 * PLANETS_ROT_SPEED * this.timePassed), new Vec3(0, 1, 0))
          .scale(Vec3.All(256))
          .translate(new Vec3(2, 0, 0))
          ;
      },
    };
    // Earth
    this.planets.earth = {
      vertbuff, elembuffer, numindi: rawShape.triangles.length,
      ref: rawShape, drawMode: ADVANCED,
      texture1: await Texture.FromUrl(gl, texUrl("earth", "day.jpg", IS_HR), Universe.COL_TEXTURE_CONFIGS(gl)),
      texture2: await Texture.FromUrl(gl, texUrl("earth", "night.jpg", IS_HR), Universe.COL_TEXTURE_CONFIGS(gl)),
      textureN: await Texture.FromUrl(gl, texUrl("earth", "normal.png", IS_HR), Universe.NORM_TEXTURE_CONFIGS(gl)),
      textureS: await Texture.FromUrl(gl, texUrl("earth", "specular.png", IS_HR), Universe.SPEC_TEXTURE_CONFIGS(gl)),
      mat: Mat4.Identity(),
      timePassed: 0,
      update: function(dt) {
        this.timePassed += dt;
        // TODO: Earth -> Sun (365dd)
        this.mat = Mat4.Identity()
          .rotate(toRad(60 * PLANETS_ROT_SPEED * this.timePassed), new Vec3(0, 1, 0))
          .translate(new Vec3(0, 0, 0))
          .scale(Vec3.All(16))
          ;
      },
      children: {
        // Moon
        moon: {
          vertbuff, elembuffer, numindi: rawShape.triangles.length,
          ref: rawShape, drawMode: DIFFUSED,
          texture1: await Texture.FromUrl(gl, texUrl("moon", "day.jpg", IS_HR), Universe.COL_TEXTURE_CONFIGS(gl)),
          mat: Mat4.Identity(),
          timePassed: 0,
          update: function(dt) {
            this.timePassed += dt;
            // TODO: Moon -> Earth (28dd)
            this.mat = Mat4.Identity()
              .rotate(toRad(20 * PLANETS_ROT_SPEED * this.timePassed), new Vec3(0, 1, 0))
              .translate(new Vec3(1, 0, 0))
              .scale(Vec3.All(0.25))
              ;
          }
        },
      },
    };
  }

  #updatePlanet(planet, dt) {
    if (planet.update) planet.update(dt);
    if (planet.children) Object.values(planet.children).forEach((child) => this.#updatePlanet(child, dt));
  }

  timePassed=0;
  #update(dt) {
    const gl = this.ctx;
    this.timePassed += dt;
    // Update planets
    Object.values(this.planets).forEach((planet) => this.#updatePlanet(planet, dt));
  }

  #drawPlanet(planet) {
    const gl = this.ctx;
    const program = this.programs.planets;
    // Push planet's matrix into the stack
    const curr = this.stack.push(planet.mat);
    const model = this.modelStack.push(planet.mat);
    // Activate & bind planet's texture
    planet.texture1.bind(0);
    planet.texture2?.bind(1);
    planet.textureN?.bind(2);
    planet.textureS?.bind(3);
    // Prepare buffers to draw
    gl.bindBuffer(gl.ARRAY_BUFFER, planet.vertbuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planet.elembuffer);
    program.enableAttributes();
    // Update uniforms      
    program.uDrawMode.update(planet.drawMode);
    program.uMatrix.update(curr.values);
    program.uModelMatrix.update(model.values);
    program.uInvTraModelMatrix.update(model.clone().inverse().transpose().values);
    // Draw planet
    gl.drawElements(gl.TRIANGLES, planet.numindi, gl.UNSIGNED_SHORT, 0);
    // Unbind buffers
    program.disableAttributes();
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Unbind texture
    Texture.Unbind(gl, 0);
    Texture.Unbind(gl, 1);
    Texture.Unbind(gl, 2);
    Texture.Unbind(gl, 3);
    // Recursive draw children
    if (planet.children) Object.values(planet.children).forEach((child) => this.#drawPlanet(child));
    // Pop planet's matrix
    this.modelStack.pop();
    this.stack.pop();
  }
  
  #drawPlanets() {
    const gl = this.ctx;
    const program = this.programs.planets;
    const sunPosition = new Vec4(0, 0, 0, 1).transform(this.planets.sun.mat).toVec3();
    const earthPosition = new Vec4(0, 0, 0, 1).transform(this.planets.earth.mat).toVec3();
    // const distance = earthPosition.clone().sub(sunPosition).magnitude();
    // const attenuation = 1.0 / (1.0 + 0.0014 * distance + 0.000007 * (distance * distance));
    // console.log(attenuation);
    // Clear framebuffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Push camera matrix
    this.stack.push(this.camera.mat);
    // Use planet's program
    program.use();
    program.uCameraPos.update(this.camera.position.values);
    program.uSunPos.update(sunPosition.values);
    program.uTexture1.update(0);
    program.uTexture2.update(1);
    program.uTextureN.update(2);
    program.uTextureS.update(3);
    // Draw each planet
    Object.values(this.planets).forEach((planet) => this.#drawPlanet(planet));
    // Unbind program
    Program.Unbind(gl);
    // Pop camera matrix
    this.stack.pop();
  }

  #draw() {
    const gl = this.ctx;
    this.#drawPlanets();
  }

  async run(gl) {
    this.ctx = gl;
    await this.#setup();
    console.log(this);
    const interval = setInterval(() => {
      try {
        this.#update(DELTA_T);
        this.#draw();
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    }, DELTA_T * 1000);
  }
}
