/** @author: Davide Risaliti davdag24@gmail.com */

import { MouseHandler, KeyboardHandler, ResizeHandler } from "webgl-basic-lib";

export class App {
  ctx=null;
  fps=60;
  camera=null;

  // MouseHandler implementation
  mHandler = new class extends MouseHandler {
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
  
  // KeyboardHandler implementation
  kHandler = new class extends KeyboardHandler {
    OnKeyDown(event) {
      // console.log("Keydown: ", event.code);
    }
    OnKeyUp(event) {
      // console.log("Keyup: ", event.code);
    }
  }
  
  // ResizeHandler implementation
  rHandler = new class extends ResizeHandler {
    OnResize(canvasSize, contextSize) {
      // console.log("Resize: ", canvasSize.toString(0), contextSize.toString(0));
    }
  }

  // Create objects
  #setup() {

  }

  // Draw loop
  #draw() {

  }

  
  // Starting point
  run(gl) {
    this.ctx = gl;
    this.#setup();
    const interval = setInterval(() => {
      try {
        this.#draw();
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    }, 1000 / this.fps);
  }
}
