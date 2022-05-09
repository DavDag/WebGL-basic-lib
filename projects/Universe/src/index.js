/** @author: Davide Risaliti davdag24@gmail.com */

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AddExtensions, RetrieveWebGLContext, Debug, SetResizeHandler, SetMouseHandler, SetKeyboardHandler } from "webgl-basic-lib";
import { Universe } from "./main.js";

async function main() {
  try {
    const app = new Universe();
    const gl = RetrieveWebGLContext("webgl", "main-canvas", true);
    AddExtensions(gl, ["WEBGL_depth_texture", "OES_texture_float", "EXT_sRGB"])
    SetResizeHandler(gl.canvasEl, app);
    SetMouseHandler(gl.canvasEl, app);
    SetKeyboardHandler(gl.canvasEl, app);
    await app.run(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
