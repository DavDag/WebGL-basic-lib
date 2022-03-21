import {RetrieveWebGLContext, SetOnClickHandler} from "webgl-basic-lib";

import {main, handler} from "./main.js";

function onload() {
  try {
    const gl = RetrieveWebGLContext("main-canvas");
    SetOnClickHandler("main-canvas", handler);
    main(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = onload;