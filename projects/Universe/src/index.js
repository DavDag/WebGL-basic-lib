import { RetrieveWebGLContext, Debug, SetResizeHandler } from "webgl-basic-lib";
import { Universe } from "./main.js";

async function main() {
  try {
    const app = new Universe();
    const gl = RetrieveWebGLContext("main-canvas");
    Debug.Initialize(gl);
    SetResizeHandler("main-canvas", app);
    await app.run(gl);
  } catch (e) {
    console.error(e);
  }
}

window.onload = main;
