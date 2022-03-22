import {RetrieveWebGLContext, SetOnClickHandler, SetKeyboardListener} from "webgl-basic-lib";

import {main, mouseHandler, keyboardHandler} from "./main.js";

function onload() {
  try {
    const gl = RetrieveWebGLContext("main-canvas");
    SetOnClickHandler("main-canvas", mouseHandler);
    SetKeyboardListener("main-canvas", keyboardHandler);
    main(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;
