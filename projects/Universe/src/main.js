/** @author: Davide Risaliti davdag24@gmail.com */

import {Texture, Vec3, Vec4, MatrixStack, Camera, toRad} from "webgl-basic-lib";
import {Earth} from "./earth.js";
import { Sun } from "./sun.js";

const IS_HR = true;
const TEX_BASE_PATH = "assets";
const DELTA_T = 1 / 30;

export class Universe {
  ctx=null;
  planets={
    earth:null,
    sun:null,
  };
  stack=null;
  modelStack=null;
  camera=null;

  onResize(canvasSize, contextSize) {
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

  zoom=2;
  onMouseWheel(event, pos) {
    this.zoom += (event.deltaY / 720);
    this.zoom = Math.min(Math.max(this.zoom, 0.75), 2.0);
    this.#updateCameraPos();
  }

  isDragging=false;
  lastPos=null;
  onMouseDown(event, pos) {
    if (event.button != 0) return;
    this.isDragging = true;
    this.lastPos = pos;
  }

  tmptmp=0;
  onMouseMove(event, pos) {
    if (!this.isDragging) return;
    const delta = this.lastPos.clone().sub(pos);
    this.lastPos = pos;
    delta.x /= this.ctx.canvas.width;
    delta.y /= this.ctx.canvas.height;
    delta.mul(this.zoom);
    this.planets.earth.rotate(delta);
    this.tmptmp -= delta.y * 30;
    this.tmptmp = Math.max(Math.min(this.tmptmp, 90), -90);
    this.#updateCameraPos();
  }

  onMouseUp(event, pos) {
    if (event.button != 0) return;
    this.isDragging = false;
    this.lastPos=null;
  }

  onMouseOut(event) {
    this.isDragging = false;
    this.lastPos=null;
  }

  #updateCameraPos() {
    const cameraPos = new Vec3(0, 0, 0);
    cameraPos.y = +Math.sin(toRad(this.tmptmp));
    cameraPos.z = -Math.cos(toRad(this.tmptmp));
    this.camera.position = new Vec3(0, cameraPos.y, cameraPos.z).mul(5 * this.zoom);
  }

  async #setup() {
    console.log("Creating Universe...");
    const gl = this.ctx;
    // ============ LOCAL OBJECTS ================
    this.stack = new MatrixStack();
    this.modelStack = new MatrixStack();
    this.camera = new Camera(45, 1.0, 0.1, 100, new Vec3(0, 0, -10), new Vec3(0, 0, 0), new Vec3(0, 1, 0), true);
    // ============ SETUP PLANETS ================
    this.planets.earth = new Earth(gl, IS_HR, TEX_BASE_PATH);
    this.planets.sun = new Sun(gl, IS_HR, TEX_BASE_PATH);
    await this.planets.earth.setup();
    await this.planets.sun.setup();
    // ===========================================
    console.log(this);
  }

  timePassed=0;
  #update(dt) {
    const gl = this.ctx;
    this.timePassed += dt;
    // ============ UPDATE PLANETS ================
    this.planets.earth.update(dt);
    this.planets.sun.update(dt);
  }
  
  #drawPlanets() {
    const gl = this.ctx;
    const sunPosition = this.planets.sun.position;
    // console.log(sunPosition.toString(4));
    // ============ DRAW SETUP ================
    // Clear framebuffer
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Push camera matrix
    this.stack.push(this.camera.mat);
    // ============ DRAW PLANETS ================
    this.planets.earth.draw(this.stack, sunPosition, this.camera.position);
    this.planets.sun.draw(this.stack, this.camera.position);
    // ==========================================
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
    console.log("Application started");
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
