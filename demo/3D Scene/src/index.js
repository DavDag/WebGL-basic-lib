/** @author: Davide Risaliti davdag24@gmail.com */

import {RetrieveWebGLContext, SetMouseHandler, SetKeyboardHandler, SetResizeHandler} from "webgl-basic-lib";

import {App} from "./main.js";

function onload() {
  try {
    const app = new App();
    const gl = RetrieveWebGLContext("main-canvas");
    app.run(gl);
    SetMouseHandler("main-canvas", app.mHandler);
    SetKeyboardHandler("main-canvas", app.kHandler);
    SetResizeHandler("main-canvas", app.rHandler);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;
