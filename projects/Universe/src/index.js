/** @author: Davide Risaliti davdag24@gmail.com */

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RetrieveWebGLContext, Debug, SetResizeHandler, SetMouseHandler, SetKeyboardHandler } from "webgl-basic-lib";
import { Universe } from "./main.js";

async function main() {
  try {
    const app = new Universe();
    const gl = RetrieveWebGLContext("main-canvas");
    let ext;
    ext = gl.getExtension('WEBGL_depth_texture');
    if (ext == null) console.error("WEBGL_depth_texture extension not supported");
    ext = gl.getExtension('OES_texture_float');
    if (ext == null) console.error("OES_texture_float extension not supported");
    // OES_texture_half_float
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
