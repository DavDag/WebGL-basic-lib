/** @author: Davide Risaliti davdag24@gmail.com */

import {Debug, Vec2} from "../all.js";

/**
 * Retrieve OpenGL ES context.
 * 
 * @params {string} name the context requested
 * @params {string} elementId the id of the canvas element to use
 * @params {boolean} isDebugEnabled a boolean to turn on/off debug
 *
 * @throws an Error when the Context cannot be retrieved
 * 
 * @return {WebGLRenderingContext} the retrieved context
 */
export function RetrieveWebGLContext(name, elementId, isDebugEnabled) {
  // Find element
  const canvas = document.getElementById(elementId);

  // Check for errors
  if (canvas == null) throw new Error("Invalid element id");

  // Initialize the GL context
  const gl = canvas.getContext(name);

  // Check for errors
  if (gl == null) throw new Error(name + " is not supported");

  // Insert canvas ref into gl context
  gl.canvasEl = canvas;

  // Initialize debug if requested
  if (isDebugEnabled) {
    Debug.Initialize(name, gl);
  }

  // Result
  return gl;
}

/**
 * Try adding extensions.
 * 
 * @params {WebGLRenderingContext} the webgl context
 * @params {list of string} the extensions array
 * 
 * @return {WebGLRenderingContext} the retrieved context
 */
export function AddExtensions(gl, ext) {
  // Add ext field to gl obj
  gl.ext = {};

  // Try adding each extension
  ext.forEach((ext) => {
    const res = gl.getExtension(ext);
    if (res == null) {
      // Log errors
      console.error(ext + " extension not supported");
    }
    gl.ext[ext] = res;
  });


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
 * @params {HTMLCanvasElement} canvas the canvas element
 * @params {object} handler an object that implements the callbacks
 */
export function SetMouseHandler(canvas, handler) {
  // Helper function to compute position
  function getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;
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
  canvas.addEventListener("mousedown", (event) => {
    if (handler.onMouseDown) {
      handler.onMouseDown(event, mousePos(event));
    }
  });
  canvas.addEventListener("mousemove", (event) => {
    if (handler.onMouseMove) {
      handler.onMouseMove(event, mousePos(event));
    }
  });
  canvas.addEventListener("mouseup", (event) => {
    if (handler.onMouseUp) {
      handler.onMouseUp(event, mousePos(event));
    }
  });
  canvas.addEventListener("wheel", (event) => {
    if (handler.onMouseWheel) {
      handler.onMouseWheel(event, mousePos(event));
    }
  });
  canvas.addEventListener("mouseleave", (event) => {
    if (handler.onMouseOut) {
      handler.onMouseOut(event);
    }
  });
}

/**
 * Interface for the Keyboard listener
 */
export class KeyboardHandler {
  onKeyDown(event) {}
  onKeyUp(event) {}
}

/**
 * Add an handler for common keyboard events.
 * 
 * @params {HTMLCanvasElement} canvas the canvas element
 * @params {object} handler an object that implements the callbacks
 */
export function SetKeyboardHandler(canvas, handler) {
  // Register to events
  document.addEventListener("keydown", (event) => {
    if (handler.onKeyDown) {
      handler.onKeyDown(event);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (handler.onKeyUp) {
      handler.onKeyUp(event);
    }
  });
}

/**
 * Interface for the Keyboard listener
 */
export class ResizeHandler {
  onResize(canvasSize, contextSize) {}
}

/**
 * Add an handler for the resize event.
 * 
 * @params {HTMLCanvasElement} canvas the canvas element
 * @params {object} handler an object that implements the callbacks
 * 
 * @throws Error when the resize event is not supported
 */
export function SetResizeHandler(canvas, handler) {
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
        if (handler.onResize) {
          handler.onResize(canvasSize, contextSize);
        }
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
