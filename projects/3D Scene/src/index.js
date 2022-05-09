/** @author: Davide Risaliti davdag24@gmail.com */

import {RetrieveWebGLContext, SetMouseHandler, SetKeyboardHandler, SetResizeHandler} from "webgl-basic-lib";

import {App} from "./main.js";

async function onload() {
  try {
    const app = new App();
    const gl = RetrieveWebGLContext("webgl", "main-canvas", true);
    SetMouseHandler(gl.canvasEl, app.mHandler);
    SetKeyboardHandler(gl.canvasEl, app.kHandler);
    SetResizeHandler(gl.canvasEl, app.rHandler);
    app.run(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;
