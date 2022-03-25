import {RetrieveWebGLContext, Vec2} from "webgl-basic-lib";

import {App} from "./main.js";

const app = new App();

const canvas = document.getElementById("main-canvas");

function setup() {
  const algSelect = document.getElementById("algo-selection");
  
  algSelect.addEventListener('change', (event) => {
    app.changeAlgorithm(event.target.value);
  });

  document.getElementById("algo-speedup").addEventListener('change', (event) => {
    app.updateSpeedup(event.target.value);
  });

  const themeSelect = document.getElementById("theme-selection");
  
  themeSelect.addEventListener('change', (event) => {
    app.updateTheme(event.target.value);
  });
  app.updateTheme(themeSelect.value);
  
  const simStart = document.getElementById("sim-start");
  const simClear = document.getElementById("sim-clear");
  const simReset = document.getElementById("sim-reset");

  const toggleButtons = () => {
    [algSelect, simStart, simClear, simReset].forEach((el) => {
      el.disabled = !el.disabled;
    });
  };
  
  simStart.addEventListener('click', async () => {
    toggleButtons();
    await app.startSimulation();
    toggleButtons();
  });

  simClear.addEventListener('click', () => {
    app.clearSimulation();
  });
  
  simReset.addEventListener('click', () => {
    app.resetSimulation();
  });
  
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);

  const hot = document.getElementById("hide-on-tab");
  
  window.addEventListener('keydown', (event) => {
    // console.log(event.code);
    if (event.code === "KeyD") {
      hot.hidden = !hot.hidden;
    }
  });
}

const MOUSE_CLICK_TIME = 150;

let isMouseDown       = false;
let lastTimeMouseDown = 0;
let canvasPos         = Vec2.Zeros();

function mousePos(event) {
  const off  = new Vec2(event.clientX, event.clientY);
  return off.sub(canvasPos);
}

function onMouseDown(event) {
  const pos = mousePos(event);
  isMouseDown = true;
  lastTimeMouseDown = performance.now();
  app.mouseDown(pos);
  // console.log(pos.toString(0));
}

function onMouseMove(event) {
  const pos = mousePos(event);
  const now = performance.now();
  const delta = now - lastTimeMouseDown;
  if (isMouseDown) {
    // Update drag
    app.mouseDrag(pos);
  } else {
    // Hover (?)
    app.mouseMove(pos);
  }
}

function onMouseUp(event) {
  const pos = mousePos(event);
  const now = performance.now();
  const delta = now - lastTimeMouseDown;
  isMouseDown = false;
  app.mouseUp(pos);
}

function getPosition(el) {
  let xPosition = 0;
  let yPosition = 0;
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop  - el.scrollTop  + el.clientTop);
    el = el.offsetParent;
    // console.log(xPosition, yPosition);
  }
  
  return new Vec2(xPosition, yPosition);
}

function onResize(entries) {
  entries.forEach((entry) => {
    if (entry.devicePixelContentBoxSize) {
      const cWidth = entry.borderBoxSize[0].inlineSize;
      const cHeight = entry.borderBoxSize[0].blockSize;
      const glWidth = entry.devicePixelContentBoxSize[0].inlineSize;
      const glHeight = entry.devicePixelContentBoxSize[0].blockSize;
      app.onCanvasResizeEvent(
        new Vec2(cWidth, cHeight).round(0),
        new Vec2(glWidth, glHeight).round(0)
      );
    } else {
      window.alert("Unsupported resize event");
    }
    // console.log(entry);
  });
}

function onload() {
  try {
    canvasPos = getPosition(canvas);
    const gl = RetrieveWebGLContext("main-canvas");
    const obs = new ResizeObserver(onResize);
    obs.observe(gl.canvasEl, {box: "content-box"});
    app.initialize(gl);
    setup();
    app.run();
  } catch (e) {
    console.error(e);
    // window.alert(e);
  }
}

window.onload = onload;
