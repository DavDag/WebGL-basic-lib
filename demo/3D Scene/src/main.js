/** @author: Davide Risaliti davdag24@gmail.com */

import { MouseHandler, KeyboardHandler, ResizeHandler, Program, Shader, Mat4, Sphere, Icosahedron, Cube, Vec3, Camera, MatrixStack, Colors, Debug, toRad } from "webgl-basic-lib";

const DELTA_T = 1000 / 60.0;
const SPEED = 1 / 100;

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
  camera=new Camera(45, 1.0, 1, 100, new Vec3(0, 0, 10), new Vec3(0, 0, -1), new Vec3(0, 1, 0));
  stack=new MatrixStack();
  time=0;

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
    uniform vec3 uColor;
    void main(void) {
      gl_FragColor = vec4(uColor, 1.0);
    }
    `);

    // Attach shaders
    program.attachShader(vshader);
    program.attachShader(fshader);
    
    // Bind attributes
    program.attributes([
      ["aPos", 3, gl.FLOAT, 32,  0],
      ["aTex", 2, gl.FLOAT, 32, 12],
      ["aNor", 3, gl.FLOAT, 32, 20],
    ]);
    
    // Link program
    program.link();
    
    // Declare uniforms
    program.declareUniforms([
      ["uMatrix", "Matrix4fv"],
      ["uColor", "3fv"]
    ]);

    // Return obj
    return program;
  }

  #createObjects() {
    const gl = this.ctx;

    const data = [
      [Sphere.asDebugShape(8,  8), Colors.Red],
      [Cube.asDebugShape(2), Colors.Green],
      [Icosahedron.asDebugShape(2), Colors.Blue],
      [Sphere.asDebugShape(4,  4), Colors.Cyan],
      [Cube.asDebugShape(1), Colors.Pink],
      [Icosahedron.asDebugShape(1), Colors.Yellow],
    ];

    // Create GL buffers
    const buffers = data.map(([obj, col]) => {
      // Array buffer (ab)
      const ab = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, ab);
      gl.bufferData(gl.ARRAY_BUFFER, obj.vertexes, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
      // Element array buffer (eab)
      const eab = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eab);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangles, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      // Buffers
      return { ab, eab, ref: obj, col};
    });

    // Matrix
    const mat = (pos, scale) => Mat4.Identity().translate(pos).scale(scale);

    // Objects
    const objects = [];

    const B = 6;
    const N = 10;
    const createObj = (size, iter) => {
      const i = Math.floor(Math.random() * B);
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      const z = Math.random() * 10 - 5;
      const mat = Mat4.Identity().translate(new Vec3(x, y, z));
      const childs = [];
      for (let i = 0; i < size; ++i) childs.push(createObj(Math.random() * (2 - iter), iter + 1));
      return {...buffers[i], mat, childs };
    }
    for (let i = 0; i < N; ++i) objects.push(createObj(Math.random() * 3, 0));

    return objects;
  }

  #setup() {
    this.program = this.#createProgram();
    this.objects = this.#createObjects();
  }

  #update() {
    this.time += DELTA_T / 1000;
    if (this.kHandler.hasUpdated) {
      // console.log("Camera updated");
      this.camera.move(this.kHandler.direction.mul(DELTA_T * SPEED));
    }
  }

  #drawObjsPass() {
    const gl = this.ctx;

    // Enable depth test
    gl.enable(gl.DEPTH_TEST);

    // Push view-proj matrix
    this.stack.push(this.camera.mat);

    // Draw function
    const drawObj = (obj, iter) => {
      const {ab, eab, ref, col, mat} = obj;
      const tmp = mat.clone().rotate(this.time, new Vec3((iter + 1) % 2, iter % 2, 0));

      // Push object's matrix
      const curr = this.stack.push(tmp);
      
      // Draw object
      gl.bindBuffer(gl.ARRAY_BUFFER, ab);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eab);
      this.program.use();
      this.program.enableAttributes();
      this.program.uMatrix.update(curr.values);
      this.program.uColor.update(col.values);
      gl.drawElements(gl.TRIANGLES, ref.numTriangles * 3, gl.UNSIGNED_SHORT, 0);
      this.program.disableAttributes();
      Program.unbind(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      // Debug
      Debug.drawLines(ref.vertexes, ref.lines, ref.vertexSize(), curr, ref.numLines, Colors.Black.toVec4(1));
      Debug.drawPoints(ref.vertexes, ref.vertexSize(), curr, ref.numVertexes, Colors.White.toVec4(1), 2.5);

      // Ricursive draw childs
      if (obj.childs) obj.childs.forEach((child) => drawObj(child, iter + 1));

      // Pop object's matrix
      this.stack.pop();
    };

    // Iterate through scene objects
    this.objects.forEach((obj) => drawObj(obj, 0));

    // Pop camera matrix
    this.stack.pop();

    // Disable depth test
    gl.disable(gl.DEPTH_TEST);
  }

  #draw() {
    const gl = this.ctx;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.#drawObjsPass();
  }

  run(gl) {
    Debug.Initialize(gl);
    console.log("App starting...");
    this.ctx = gl;
    this.#setup();
    console.log("Setup done correctly:", this.objects);
    const interval = setInterval(() => {
      try {
        this.#update();
        this.#draw();
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    }, DELTA_T);
  }
}
