/** @author: Davide Risaliti davdag24@gmail.com */

/*
 * Retrieve OpenGL ES context.
 * 
 * @params {string} elementId the id of the canvas element to use
 *
 * @throws an Error when the Context cannot be retrieved
 * 
 * @return {WebGLRenderingContext} the retrieved context
 */
export function RetrieveWebGLContext(elementId) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Check for errors
  if (canvas == null) reject("Invalid element id");

  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Check for errors
  if (gl == null) throw new Error("WebGL is not supported");

  // Result
  return gl;
}
