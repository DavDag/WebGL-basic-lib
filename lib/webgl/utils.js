/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec2} from "../all.js";

/**
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
  if (canvas == null) throw new Error("Invalid element id");

  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Check for errors
  if (gl == null) throw new Error("WebGL is not supported");

  // Insert canvas ref into gl context
  gl.canvasEl = canvas;

  // Result
  return gl;
}

/**
 * Add an handler for common pointer operations and compute the position mapping process.
 * 
 * @params {string} elementId the id of the canvas element to use
 * 
 * @params {object} handler an object that implements the callbacks
 */
export function SetOnClickHandler(elementId, handler) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Helper function to compute position
  function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;
    while (el) {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop  - el.scrollTop  + el.clientTop);
      el = el.offsetParent;
    }    
    return new Vec2(xPosition, yPosition);
  }

  // Store position
  const canvasPos = getPosition(canvas);

  // Lambda to help readability
  const mousePos = (event) => new Vec2(event.clientX, event.clientY).sub(canvasPos);

  // Register to events
  canvas.addEventListener("mousedown", (event) => handler.onMouseDown(event, mousePos(event)));
  canvas.addEventListener("mousemove", (event) => handler.onMouseMove(event, mousePos(event)));
  canvas.addEventListener("mouseup", (event) => handler.onMouseUp(event, mousePos(event)));
  canvas.addEventListener("wheel", (event) => handler.onMouseWheel(event, mousePos(event)));
  canvas.addEventListener("mouseleave", (event) => handler.onMouseOut(event));
}

/**
 * Add an handler for common keyobard events.
 * 
 * @params {string} elementId the id of the canvas element to use
 * 
 * @params {object} handler an object that implements the callbacks
 * 
 */
export function SetKeyboardListener(elementId, handler) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Register to events
  document.addEventListener("keydown", handler.OnKeyDown);
  document.addEventListener("keyup", handler.OnKeyUp);
}
