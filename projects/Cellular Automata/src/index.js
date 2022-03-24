/** @author: Davide Risaliti davdag24@gmail.com */

import {RetrieveWebGLContext, SetMouseHandler, SetKeyboardHandler} from "webgl-basic-lib";

import {main, mouseHandler, keyboardHandler} from "./main.js";

function onload() {
  try {
    const gl = RetrieveWebGLContext("main-canvas");
    SetMouseHandler("main-canvas", mouseHandler);
    SetKeyboardHandler("main-canvas", keyboardHandler);
    main(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;
