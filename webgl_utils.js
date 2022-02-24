/*
 * Retrieve OpenGL ES context.
 * 
 * Params:
 *  elementId (string)
 * 
 * Returns a Promise:
 *  on success => context
 *  on error   => otherwise
 */
export async function RetrieveWebGLContext(elementId) {
  // Create Promise
  return new Promise((resolve, reject) => {

    // Find element
    const canvas = document.getElementById(elementId);

    // Check for errors
    if (canvas == null) reject("Invalid element id");

    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Result
    (gl === null) ? reject("WebGL is not supported") : resolve(gl);
  });
}
