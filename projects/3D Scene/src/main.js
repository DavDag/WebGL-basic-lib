/** @author: Davide Risaliti davdag24@gmail.com */

import { MouseHandler, KeyboardHandler, ResizeHandler, Program, Shader, Mat4,
  Sphere, Icosahedron, Cube, Cylinder, Vec3, Camera, MatrixStack, Colors, Debug, toRad } from "webgl-basic-lib";

const DELTA_T = 1000 / 60.0;
const SPEED = 1 / 1000;

const COLORED = 0;
const TEXTURED = 1;
const NORMAL_AS_COLOR = 2;
const PHONG_DIFFUSE = 3;
const PHONG_COMPLETE = 4;

const LOW_SHININESS = 2;
const HIGH_SHININESS = 32;

const LIGHT_COLOR = Colors.White;
// const LIGHT_COLOR = Colors.Random();

const LIGHT_DIRECTION = new Vec3(-1, -1, 0).negate().normalize();

class MyMHandler extends MouseHandler {
  app=null;
  constructor(app){ super(); this.app = app; }
  isDragging=false;
  lastpos=null;
  onMouseDown(event, pos) {
    // console.log("Mouse down: ", pos.toString(0));
    this.lastpos = pos.clone();
    this.isDragging = true;
  }
  onMouseMove(event, pos) {
    // console.log("Mouse move: ", pos.toString(0));
    if (this.isDragging) {
      const delta = this.lastpos.sub(pos).mul(0.005);
      this.lastpos = pos.clone();
      delta.x *= -1;
      this.app.camera.moveDir(delta.toVec3(0));
      // console.log(this.app.camera.direction.toString(4));
    }
  }
  onMouseUp(event, pos) {
    // console.log("Mouse up: ", pos.toString(0));
    this.isDragging = false;
  }
  onMouseWheel(event, pos) {
    // console.log("Mouse wheel: ", pos.toString(0));
  }
  onMouseOut(event) {
    // console.log("Mouse out");
    this.isDragging = false;
  }
}

class MyKHandler extends KeyboardHandler {
  app=null;
  R=false; L=false; U=false; D=false; F=false; B=false;
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
  camera=new Camera(45, 1.0, 1, 100, new Vec3(0, 3, 2), new Vec3(0, -1.5, -1).normalize(), new Vec3(0, 1, 0), false);
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
    attribute vec3 aPos;
    attribute vec2 aTex;
    attribute vec3 aNor;
    uniform mat4 uMatrix;
    uniform mat4 uModelMatrix;
    uniform mat3 uNormalMatrix;
    varying vec2 vTex;
    varying vec3 vFragPos;
    varying vec3 vNor;
    void main(void) {
      vTex = aTex;
      vFragPos = vec3(uModelMatrix * vec4(aPos, 1.0));
      vNor = uNormalMatrix * aNor;
      gl_Position = uMatrix * vec4(aPos, 1.0);
    }
    `);
    const fshader = new Shader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform vec3 uColor;
    uniform float uMode;
    uniform float uAmbFac;
    uniform float uSpecPow;
    uniform vec3 uLightCol;
    uniform vec3 uLightDir;
    uniform vec3 uViewPos;
    varying vec2 vTex;
    varying vec3 vFragPos;
    varying vec3 vNor;
    vec4 colored() {
      // uColor
      return vec4(uColor, 1.0);
    }
    vec4 textured() {
      // Pinkish
      return vec4(0.93, 0.25, 0.49, 1.0);
    }
    vec4 normal_as_color(vec3 normal) {
      // Normal is color instead
      return vec4(normal, 1.0);
    }
    vec4 diffused(vec3 normal, vec3 viewDir, bool addSpec) {
      // Light (Ambient + diffuse + specular)
      float ambient = uAmbFac;
      float diffuse = max(dot(normal, uLightDir), 0.0);
      float specular = 0.0;
      if (addSpec) {
        vec3 reflectDir = reflect(-uLightDir, normal);
        specular = pow(max(dot(reflectDir, viewDir), 0.0), uSpecPow);
      }
      return vec4((ambient + diffuse + specular) * uLightCol * uColor, 1.0);
    }
    vec4 fallback() {
      // Orangish
      return vec4(0.86, 0.57, 0.07, 1.0);
    }
    void main(void) {
      vec3 normal = normalize(vNor);
      vec3 viewDir = normalize(uViewPos - vFragPos);
      if (uMode == 0.0)
      {
        gl_FragColor = colored();
      }
      else if (uMode == 1.0)
      {
        gl_FragColor = textured();
      }
      else if (uMode == 2.0)
      {
        gl_FragColor = normal_as_color(normal);
      }
      else if (uMode == 3.0)
      {
        gl_FragColor = diffused(normal, viewDir, false);
      }
      else if (uMode == 4.0)
      {
        gl_FragColor = diffused(normal, viewDir, true);
      }
      else
      {
        gl_FragColor = fallback();
      }
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
      ["uMode", "1f"],
      ["uColor", "3fv"],
      ["uAmbFac", "1f"],
      ["uSpecFac", "1f"],
      ["uSpecPow", "1f"],
      ["uLightCol", "3fv"],
      ["uLightDir", "3fv"],
      ["uModelMatrix", "Matrix4fv"],
      ["uNormalMatrix", "Matrix3fv"],
      ["uViewPos", "3fv"],
    ]);

    // Return obj
    return program;
  }

  #createBuffers(vert, indi) {
    const gl = this.ctx;

    const arrbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrbuff);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    const elembuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elembuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indi, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return {arrbuff, elembuff, numvert: vert.length, numindi: indi.length};
  }

  #createObjects() {
    const gl = this.ctx;
    
    const axis = {
      ...this.#createBuffers(new Float32Array([
        0, 0, 0, 0, 0, 1, 0, 0,
        1, 0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 1,
        0, 0, 1, 0, 0, 0, 0, 1,
      ]), new Uint16Array([
        0, 1, 2, 3, 4, 5
      ])),
      drawMode: "LINES",
      mat: Mat4.Identity(),
      uMode: NORMAL_AS_COLOR,
      col: Colors.Random(),
    };

    const rawCube = Cube.asDebugShape();
    const rawCubeBuffers = this.#createBuffers(rawCube.vertexes, rawCube.triangles);
    const cube1 = {
      ...rawCubeBuffers,
      ref: rawCube,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.25, 0, -0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cube2 = {
      ...rawCubeBuffers,
      ref: rawCube,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.75, 0, -0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cube3 = {
      ...rawCubeBuffers,
      ref: rawCube,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.25, 0, -0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cube4 = {
      ...rawCubeBuffers,
      ref: rawCube,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.75, 0, -0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };

    const rawCylinder6 = Cylinder.asDebugShape(6);
    const rawCylinder6Buffers = this.#createBuffers(rawCylinder6.vertexes, rawCylinder6.triangles);
    const rawCylinder12 = Cylinder.asDebugShape(12);
    const rawCylinder12Buffers = this.#createBuffers(rawCylinder12.vertexes, rawCylinder12.triangles);
    const cylinder1 = {
      ...rawCylinder6Buffers,
      ref: rawCylinder6,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.25, 0, -0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cylinder2 = {
      ...rawCylinder6Buffers,
      ref: rawCylinder6,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.75, 0, -0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cylinder3 = {
      ...rawCylinder12Buffers,
      ref: rawCylinder12,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.25, 0, -0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const cylinder4 = {
      ...rawCylinder12Buffers,
      ref: rawCylinder12,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.75, 0, -0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0.5, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };

    const rawSphere4 = Sphere.asDebugShape(4, 4);
    const rawSphere4Buffers = this.#createBuffers(rawSphere4.vertexes, rawSphere4.triangles);
    const rawSphere8 = Sphere.asDebugShape(8, 8);
    const rawSphere8Buffers = this.#createBuffers(rawSphere8.vertexes, rawSphere8.triangles);
    const sphere1 = {
      ...rawSphere4Buffers,
      ref: rawSphere4,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.25, 0, 0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const sphere2 = {
      ...rawSphere8Buffers,
      ref: rawSphere8,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.75, 0, 0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const sphere3 = {
      ...rawSphere4Buffers,
      ref: rawSphere4,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.25, 0, 0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const sphere4 = {
      ...rawSphere8Buffers,
      ref: rawSphere8,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(0.75, 0, 0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };

    const rawIcosahedron0 = Icosahedron.asDebugShape(0);
    const icosahedron0Buffers = this.#createBuffers(rawIcosahedron0.vertexes, rawIcosahedron0.triangles);
    const rawIcosahedron2 = Icosahedron.asDebugShape(2);
    const icosahedron2Buffers = this.#createBuffers(rawIcosahedron2.vertexes, rawIcosahedron2.triangles);
    const icosahedron1 = {
      ...icosahedron0Buffers,
      ref: rawIcosahedron0,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.25, 0, 0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const icosahedron2 = {
      ...icosahedron0Buffers,
      ref: rawIcosahedron0,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.75, 0, 0.25))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const icosahedron3 = {
      ...icosahedron2Buffers,
      ref: rawIcosahedron2,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.25, 0, 0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: LOW_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(45 * dt), new Vec3(0, 1, 1).normalize());
      }
    };
    const icosahedron4 = {
      ...icosahedron2Buffers,
      ref: rawIcosahedron2,
      drawMode: "TRIANGLES",
      mat: Mat4.Identity()
        .translate(new Vec3(-0.75, 0, 0.75))
        .scale(Vec3.All(0.25))
        .translate(new Vec3(0, 0, 0)),
      uMode: PHONG_COMPLETE,
      col: Colors.Random(),
      shininess: HIGH_SHININESS,
      update: function(dt) {
        this.mat.rotate(toRad(30 * dt), new Vec3(0, 1, 1).normalize());
      }
    };

    const objects = [];
    objects.push(axis);
    objects.push(cube1);
    objects.push(cube2);
    objects.push(cube3);
    objects.push(cube4);
    objects.push(cylinder1);
    objects.push(cylinder2);
    objects.push(cylinder3);
    objects.push(cylinder4);
    objects.push(sphere1);
    objects.push(sphere2);
    objects.push(sphere3);
    objects.push(sphere4);
    objects.push(icosahedron1);
    objects.push(icosahedron2);
    objects.push(icosahedron3);
    objects.push(icosahedron4);
    return objects;
  }

  #setup() {
    this.program = this.#createProgram();
    this.objects = this.#createObjects();
  }

  #update() {
    this.time += DELTA_T / 1000;
    if (this.kHandler.hasUpdated) {
      const d = this.kHandler.direction;
      // console.log("Camera updated");
      this.camera.movePos(this.kHandler.direction.mul(DELTA_T * SPEED));
    }
    this.objects.forEach((obj) => { if (obj.update) obj.update(DELTA_T / 1000); });
  }

  #drawObjsPass() {
    const gl = this.ctx;

    // Enable depth test
    gl.enable(gl.DEPTH_TEST);

    // Push view-proj matrix
    this.stack.push(this.camera.mat);

    // Draw function
    const drawObj = (obj, iter) => {
      // Push object's matrix
      const curr = this.stack.push(obj.mat);
      
      // Draw object
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.arrbuff);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.elembuff);
      this.program.enableAttributes();
      this.program.uMatrix.update(curr.values);
      const normal = obj.mat.clone().inverse().transpose().toMat3();
      this.program.uNormalMatrix.update(normal.values);
      this.program.uModelMatrix.update(obj.mat.values);
      this.program.uMode.update(obj.uMode);
      this.program.uColor.update(obj.col.values);
      this.program.uSpecPow.update(obj.shininess);
      gl.drawElements(gl[obj.drawMode], obj.numindi, gl.UNSIGNED_SHORT, 0);
      this.program.disableAttributes();
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      // Ricursive draw childs
      if (obj.childs) obj.childs.forEach((child) => drawObj(child, iter + 1));

      // Pop object's matrix
      this.stack.pop();
    };
    
    // Iterate through scene objects
    this.program.use();
    this.program.uViewPos.update(this.camera.position.values);
    this.program.uAmbFac.update(0.1);
    this.program.uLightCol.update(LIGHT_COLOR.values);
    this.program.uLightDir.update(LIGHT_DIRECTION.values);
    this.objects.forEach((obj) => drawObj(obj, 0));
    Program.unbind(gl);
    
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
    console.log("Left and Right columns have high shininess.");
    console.log("Central columns have low shininess.");
    console.log("Light direction is: ", LIGHT_DIRECTION.toString(2));
    console.log("Light color is: ", LIGHT_COLOR.toString(2));
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
