import {Shader, Program, Texture, Debug, Sphere, Mat4, toRad, Vec3, Vec4, MatrixStack, Camera, Icosahedron } from "webgl-basic-lib";

const IS_HR = false;
const DELTA_T = 1 / 60;
const texUrl = (planet, isHR, isDay) => `/assets/${planet}/${((isHR) ? "8k" : "2k")}/${((isDay) ? "day" : "night")}.jpg`;

export class Universe {
  ctx=null;
  programs={
    planets:null,
  };
  planets={
    earth:null,
  };
  stack=null;
  camera=null;

  static TEXTURE_CONFIGS = (gl) => { return {
    target: gl.TEXTURE_2D,
    level: 0,
    format: gl.RGBA,
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
  uniform mat4 uMatrix;
  varying vec2 vTex;
  void main(void) {
    vTex = aTex;
    gl_Position = uMatrix * vec4(aPos, 1.0);
  }
  `;

  static F_SHADER_SRC =
  `
  precision highp float;
  varying vec2 vTex;
  uniform sampler2D uTexture;
  void main(void) {
    gl_FragColor = texture2D(uTexture, vTex);
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
    this.camera = new Camera(45, 1.0, 0.1, 100, new Vec3(0, 4, -8), new Vec3(0, 0, 0), new Vec3(0, 1, 0), true);
    // Planets program
    const program = new Program(gl);
    program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Universe.V_SHADER_SRC));
    program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Universe.F_SHADER_SRC));
    program.attributes([
      ["aPos", 3, gl.FLOAT, 32,  0],
      ["aTex", 2, gl.FLOAT, 32, 12],
      ["aNor", 3, gl.FLOAT, 32, 20],
    ]);
    program.link();
    program.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uTexture", "1i"]
    ]);
    this.programs.planets = program;
    // Planets
    const rawShape = Sphere.asAdvancedShape(12, 12);  
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
      ref: rawShape,
      textureD: await Texture.FromUrl(gl, texUrl("sun", IS_HR, true), Universe.TEXTURE_CONFIGS(gl)),
      textureN: await Texture.FromUrl(gl, texUrl("sun", IS_HR, true), Universe.TEXTURE_CONFIGS(gl)),
      mat: Mat4.Identity(),
      update: function(dt) {
        this.mat
          .rotate(toRad(45 * dt), new Vec3(0, 1, 0))
      },
    };
    // Earth
    this.planets.earth = {
      vertbuff, elembuffer, numindi: rawShape.triangles.length,
      ref: rawShape,
      textureD: await Texture.FromUrl(gl, texUrl("earth", IS_HR, true), Universe.TEXTURE_CONFIGS(gl)),
      textureN: await Texture.FromUrl(gl, texUrl("earth", IS_HR, false), Universe.TEXTURE_CONFIGS(gl)),
      mat: Mat4.Identity(),
      timePassed: 0,
      update: function(dt) {
        this.timePassed += dt;
        this.mat = Mat4.Identity()
          .rotate(toRad(30 * this.timePassed), new Vec3(0, 1, 0))
          .translate(new Vec3(3, 0, 0))
          .rotate(toRad(30 * this.timePassed), new Vec3(0, 1, 0))
          .scale(Vec3.All(0.25))
          ;
      },
      children: {
        // Moon
        moon: {
          vertbuff, elembuffer, numindi: rawShape.triangles.length,
          ref: rawShape,
          textureD: await Texture.FromUrl(gl, texUrl("moon", IS_HR, true), Universe.TEXTURE_CONFIGS(gl)),
          textureN: await Texture.FromUrl(gl, texUrl("moon", IS_HR, true), Universe.TEXTURE_CONFIGS(gl)),
          mat: Mat4.Identity().translate(new Vec3(0.75, 0, 0)).scale(Vec3.All(0.25)),
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
    // const earthPos = this.planets.earth.mat.col(3).toVec3();
    // this.camera.target = earthPos.clone();
    // this.camera.position = new Vec3(0, 0, -1).add(earthPos);
    // Update planets
    Object.values(this.planets).forEach((planet) => this.#updatePlanet(planet, dt));
  }

  #drawPlanet(planet) {
    const gl = this.ctx;
    const program = this.programs.planets;
    // Push planet's matrix into the stack
    const curr = this.stack.push(planet.mat);
    // Activate & bind planet's texture
    planet.textureD.bind(0);
    // Prepare buffers to draw
    gl.bindBuffer(gl.ARRAY_BUFFER, planet.vertbuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planet.elembuffer);
    program.enableAttributes();
    // Update uniforms      
    program.uMatrix.update(curr.values);
    program.uTexture.update(0);
    // Draw planet
    gl.drawElements(gl.TRIANGLES, planet.numindi, gl.UNSIGNED_SHORT, 0);
    // Unbind buffers
    program.disableAttributes();
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Unbind texture
    Texture.Unbind(gl, 0);
    // Recursive draw children
    if (planet.children) Object.values(planet.children).forEach((child) => this.#drawPlanet(child));
    // Pop planet's matrix
    this.stack.pop();
  }
  
  #drawPlanets() {
    const gl = this.ctx;
    const program = this.programs.planets;
    // Clear framebuffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Push camera matrix
    this.stack.push(this.camera.mat);
    // Use planet's program
    program.use();
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
