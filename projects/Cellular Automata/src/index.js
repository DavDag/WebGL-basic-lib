/** @author: Davide Risaliti davdag24@gmail.com */

import {RetrieveWebGLContext, SetMouseHandler, SetKeyboardHandler} from "webgl-basic-lib";

import {main, mouseHandler, keyboardHandler} from "./main.js";

function onload() {
  try {
    const gl = RetrieveWebGLContext("webgl", "main-canvas", false);
    SetMouseHandler(gl.canvasEl, mouseHandler);
    SetKeyboardHandler(gl.canvasEl, keyboardHandler);
    main(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;
