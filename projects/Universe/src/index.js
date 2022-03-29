/** @author: Davide Risaliti davdag24@gmail.com */

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RetrieveWebGLContext, Debug, SetResizeHandler, SetMouseHandler, SetKeyboardHandler } from "webgl-basic-lib";
import { Universe } from "./main.js";

async function main() {
  try {
    const app = new Universe();
    const gl = RetrieveWebGLContext("main-canvas");
    Debug.Initialize(gl);
    // TODO: Add utility
    gl.ext = {};
    const extensions = ["WEBGL_depth_texture", "OES_texture_float", "EXT_sRGB"];
    extensions.forEach((ext) => {
      const res = gl.getExtension(ext);
      if (res == null) {
        console.error(ext + " extension not supported");
      }
      gl.ext[ext] = res;
    });
    // 
    SetResizeHandler(gl.canvasEl, app);
    SetMouseHandler(gl.canvasEl, app);
    SetKeyboardHandler(gl.canvasEl, app);
    await app.run(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
