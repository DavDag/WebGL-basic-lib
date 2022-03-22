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
 * Interface for the Mouse listener
 */
export class MouseHandler {
  onMouseDown(event, mousePos) {}
  onMouseMove(event, mousePos) {}
  onMouseUp(event, mousePos) {}
  onMouseWheel(event, mousePos) {}
  onMouseOut(event) {}
}

/**
 * Add an handler for common pointer operations and compute the position mapping process.
 * 
 * @params {string} elementId the id of the canvas element to use
 * 
 * @params {object} handler an object that implements the callbacks
 */
export function SetMouseHandler(elementId, handler) {
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
 * Interface for the Keyboard listener
 */
export class KeyboardHandler {
  OnKeyDown(event) {}
  OnKeyUp(event) {}
}

/**
 * Add an handler for common keyboard events.
 * 
 * @params {string} elementId the id of the canvas element to use
 * 
 * @params {object} handler an object that implements the callbacks
 */
export function SetKeyboardHandler(elementId, handler) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Register to events
  document.addEventListener("keydown", (event) => handler.OnKeyDown(event));
  document.addEventListener("keyup", (event) => handler.OnKeyUp(event));
}

/**
 * Interface for the Keyboard listener
 */
export class ResizeHandler {
  OnResize(canvasSize, contextSize) {}
}

/**
 * Add an handler for the resize event.
 * 
 * @params {string} elementId the id of the canvas element to use
 * 
 * @params {object} handler an object that implements the callbacks
 * 
 * @throws Error when the resize event is not supported
 */
export function SetResizeHandler(elementId, handler) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Resize helper function
  function onResize(entries) {
    entries.forEach((entry) => {
      if (entry.devicePixelContentBoxSize) {
        const cWidth = entry.borderBoxSize[0].inlineSize;
        const cHeight = entry.borderBoxSize[0].blockSize;
        const glWidth = entry.devicePixelContentBoxSize[0].inlineSize;
        const glHeight = entry.devicePixelContentBoxSize[0].blockSize;
        const canvasSize = new Vec2(cWidth, cHeight).round(0);
        const contextSize = new Vec2(glWidth, glHeight).round(0);
        handler.OnResize(canvasSize, contextSize);
      } else {
        throw new Error("Unsupported resize event");
      }
    });
  }

  // Create observer
  const obs = new ResizeObserver(onResize);

  // Register to resize event
  obs.observe(canvas, {box: "content-box"});
}
