/** @author: Davide Risaliti davdag24@gmail.com */

import { MouseHandler, KeyboardHandler, ResizeHandler, Program, Shader, Mat4, Sphere, toRad, Vec3, Camera } from "webgl-basic-lib";

const DELTA_T = 1000 / 60.0;
const SPEED = 1 / 1000;

class MyMHandler extends MouseHandler {
  app=null;
  constructor(app){ super(); this.app = app; }
  onMouseDown(event, pos) {
    // console.log("Mouse down: ", pos.toString(0));
  }
  onMouseMove(event, pos) {
    // console.log("Mouse move: ", pos.toString(0));
  }
  onMouseUp(event, pos) {
    // console.log("Mouse up: ", pos.toString(0));
  }
  onMouseWheel(event, pos) {
    // console.log("Mouse wheel: ", pos.toString(0));
  }
  onMouseOut(event) {
    // console.log("Mouse out");
  }
}

class MyKHandler extends KeyboardHandler {
  app=null;
  R=false;
  L=false;
  U=false;
  D=false;
  F=false;
  B=false;
  constructor(app){ super(); this.app = app; }
  OnKeyDown(event) {
    // console.log("Keydown: ", event.code);
    if (event.code === "KeyD") this.R = true;
    if (event.code === "KeyA") this.L = true;
    if (event.code === "KeyS") this.B = true;
    if (event.code === "KeyW") this.F = true;
    if (event.code === "Space") this.U = true;
    if (event.code === "ShiftLeft") this.D = true;
  }
  OnKeyUp(event) {
    // console.log("Keyup: ", event.code);
    if (event.code === "KeyD") this.R = false;
    if (event.code === "KeyA") this.L = false;
    if (event.code === "KeyS") this.B = false;
    if (event.code === "KeyW") this.F = false;
    if (event.code === "Space") this.U = false;
    if (event.code === "ShiftLeft") this.D = false;
  }
  get direction() {
    const x = -(+this.L) + (+this.R);
    const y = -(+this.D) + (+this.U);
    const z = -(+this.F) + (+this.B);
    return new Vec3(x, y, z);
  }
  get hasUpdated() {
    return this.L || this.R || this.B || this.F || this.U || this.D;
  }
}

class MyRHandler extends ResizeHandler {
  app=null;
  constructor(app){ super(); this.app = app; }
  OnResize(canvasSize, contextSize) {
    // console.log("Resize: ", canvasSize.toString(0), contextSize.toString(0));
    const gl = this.app.ctx;
    gl.canvasEl.width  = canvasSize.w;
    gl.canvasEl.height = canvasSize.h;
    gl.canvas.width    = contextSize.w;
    gl.canvas.height   = contextSize.h;
    gl.viewport(0, 0, contextSize.w, contextSize.h);
    const factor = contextSize.w / contextSize.h;
    this.app.camera.ratio = factor;
  }
}

export class App {
  ctx=null;
  program=null;
  objects=null;
  camera=new Camera(45, 1.0, 1, 100, new Vec3(0, 0, 5), new Vec3(0, 0, -1), new Vec3(0, 1, 0));

  mHandler = new MyMHandler(this);
  kHandler = new MyKHandler(this);
  rHandler = new MyRHandler(this);

  #createProgram() {
    const gl = this.ctx;

    // Create objects
    const program = new Program(gl);    
    const vshader = new Shader(gl, gl.VERTEX_SHADER, `
    precision mediump float;
    attribute vec4 aPos;
    attribute vec2 aTex;
    uniform mat4 uMatrix;
    varying vec2 vTex;
    void main(void) {
      vTex = aTex;
      gl_Position = uMatrix * aPos;
    }
    `);
    const fshader = new Shader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec2 vTex;
    void main(void) {
      gl_FragColor = vec4(vTex.xy, 0.0, 1.0);
      // gl_FragColor = vec4(1, 1, 1, 1);
    }
    `);

    // Attach shaders
    program.attachShader(vshader);
    program.attachShader(fshader);
    
    // Bind attributes
    program.attributes([
      ["aPos", 3, gl.FLOAT, 20,  0],
      ["aTex", 2, gl.FLOAT, 20, 12]
    ]);
    
    // Link program
    program.link();
    
    // Declare uniforms
    program.declareUniforms([
      ["uMatrix", "Matrix4fv"]
    ]);

    // Return obj
    return program;
  }

  #createObjects() {
    const gl = this.ctx;

    const sphere = Sphere.asTexturedShape(8, 8);

    // Array buffer (ab)
    const ab = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ab);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.verteces, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    // Element array buffer (eab)
    const eab = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eab);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.triangles, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Create objects
    const objects = [
      { ab, eab, nv: sphere.numVerteces, ni: sphere.numTriangles * 3, ref: sphere, mat: Mat4.Identity() }
    ];

    // Return objects
    return objects;
  }

  #setup() {
    this.program = this.#createProgram();
    this.objects = this.#createObjects();
  }

  #draw() {
    const gl = this.ctx;

    // 1.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 2.
    gl.enable(gl.DEPTH_TEST);

    if (this.kHandler.hasUpdated) {
      // console.log("camera updated");
      this.camera.move(this.kHandler.direction.mul(DELTA_T * SPEED));
    }
    this.objects.forEach(({ab, eab, nv, ni, obj, mat}) => {
      const curr = this.camera.mat.clone().apply(mat);

      gl.bindBuffer(gl.ARRAY_BUFFER, ab);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eab);
  
      this.program.use();
      this.program.enableAttributes();
      this.program.uMatrix.update(curr.values);
  
      gl.drawElements(gl.TRIANGLES, ni, gl.UNSIGNED_SHORT, 0);
  
      this.program.disableAttributes();
      Program.unbind(gl);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    });

    gl.disable(gl.DEPTH_TEST);

    // 3.
  }

  
  // Starting point
  run(gl) {
    console.log("App starting...");
    this.ctx = gl;
    this.#setup();
    console.log("Setup done correctly:", this.objects);
    const interval = setInterval(() => {
      try {
        this.#draw();
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    }, DELTA_T);
  }
}
