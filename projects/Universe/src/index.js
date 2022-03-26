/** @author: Davide Risaliti davdag24@gmail.com */

import { RetrieveWebGLContext, Debug, SetResizeHandler, SetMouseHandler, SetKeyboardHandler } from "webgl-basic-lib";
import { Universe } from "./main.js";

async function main() {
  try {
    const app = new Universe();
    const gl = RetrieveWebGLContext("main-canvas");
    Debug.Initialize(gl);
    SetResizeHandler(gl.canvasEl, app);
    SetMouseHandler(gl.canvasEl, app);
    SetKeyboardHandler(gl.canvasEl, app);
    await app.run(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
