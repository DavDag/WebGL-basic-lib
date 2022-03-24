import {Debug, Colors, Vec2} from "webgl-basic-lib";

import {Algorithms} from "./algs.js";
import {Grid} from "./grid.js";

const fpsText        = document.getElementById("fpsText");
const screenSizeText = document.getElementById("screenSizeText");
const cellSizeText   = document.getElementById("cellSizeText");
const cellCountText  = document.getElementById("cellCountText");

const UPDATE_CANVAS_DELAY = 1000;

const Themes = [
  // Brown
  {
    unexp_f: Colors.HexToRgb("#DBBEA1"),
    exp_f:   Colors.HexToRgb("#DB7F67"),
    wall_f:  Colors.HexToRgb("#3F292B"),
    start_f: Colors.HexToRgb("#D34F73"),
    end_f:   Colors.HexToRgb("#A37B73"),
    path_f:  Colors.HexToRgb("#893C4F"),

    unexp_b: Colors.HexToRgb("#000000"),
    exp_b:   Colors.HexToRgb("#000000"),
    wall_b:  Colors.HexToRgb("#FF0000"),
    start_b: Colors.HexToRgb("#000000"),
    end_b:   Colors.HexToRgb("#000000"),
    path_b:  Colors.HexToRgb("#000000"),
  },
  // Green
  {
    unexp_f: Colors.HexToRgb("#84DCC6"),
    exp_f:   Colors.HexToRgb("#4B4E6D"),
    wall_f:  Colors.HexToRgb("#222222"),
    start_f: Colors.HexToRgb("#488480"),
    end_f:   Colors.HexToRgb("#95A3B3"),
    path_f:  Colors.HexToRgb("#FFFFFF"),

    unexp_b: Colors.HexToRgb("#000000"),
    exp_b:   Colors.HexToRgb("#000000"),
    wall_b:  Colors.HexToRgb("#000000"),
    start_b: Colors.HexToRgb("#000000"),
    end_b:   Colors.HexToRgb("#000000"),
    path_b:  Colors.HexToRgb("#000000"),
  },
  // Pink
  {
    unexp_f: Colors.HexToRgb("#B69191"),
    exp_f:   Colors.HexToRgb("#AF465D"),
    wall_f:  Colors.HexToRgb("#424B54"),
    start_f: Colors.HexToRgb("#E2B4BD"),
    end_f:   Colors.HexToRgb("#93A8AC"),
    path_f:  Colors.HexToRgb("#C2C2C2"),

    unexp_b: Colors.HexToRgb("#000000"),
    exp_b:   Colors.HexToRgb("#000000"),
    wall_b:  Colors.HexToRgb("#000000"),
    start_b: Colors.HexToRgb("#000000"),
    end_b:   Colors.HexToRgb("#000000"),
    path_b:  Colors.HexToRgb("#000000"),
  }
];

export class App {
  #gl;

  #grid;
  
  #shouldUpdateCanvas;
  #glContextSize;
  #canvasSize;
  #cellSize;

  #now;
  #lastTime;
  #totTime;
  #fpsCount;
  #deltaTime;

  #canvasSizeUpdateTime;

  #algorithm;

  #isDragging;

  constructor(gl) {
    this.#gl   = null;
    this.#grid = null;
    this.#shouldUpdateCanvas = false;
    this.#glContextSize      = Vec2.Zeros();
    this.#canvasSize         = Vec2.Zeros();
    this.#cellSize  = 50;
    this.#now       = 0;
    this.#lastTime  = 0;
    this.#totTime   = 0;
    this.#fpsCount  = 0;
    this.#deltaTime = 0;
    this.#canvasSizeUpdateTime = 0;
    this.#algorithm = null;
    this.#isDragging = false;
  }

  initialize(gl) {
    Debug.Initialize(gl);
    this.#gl = gl;
    this.#grid = new Grid(gl);
    this.changeAlgorithm("bfs");
  }
  
  onCanvasResizeEvent(canvasSize, glContextSize) {
    this.#canvasSize = canvasSize;
    this.#glContextSize = glContextSize;
    this.#shouldUpdateCanvas = true;
  }

  run() {
    const interval = setInterval(() => {
      try {
        this.#update();
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    }, 1000 / 30.0);
  }

  changeAlgorithm(algoName) {
    this.#algorithm = Algorithms[algoName];
  }

  async startSimulation() {
    this.#grid.clear();
    this.#grid.disableEditing();
    try {
      await this.#algorithm(
        this.#grid,
        this.#grid.sp.clone(),
        this.#grid.ep.clone()
      );
    } catch(e) {
      console.error(err);
    }
  }
  
  clearSimulation() {
    this.#grid.clear();
    this.#grid.enableEditing();
  }
  
  resetSimulation() {
    this.#grid.reset();
    this.#grid.enableEditing();
  }

  click(mousePos) {
    this.#grid.click(mousePos);
  }

  updateSpeedup(value) {
    Algorithms.speedup = Math.min(Math.max(value, 0.0), 10.0);
    // console.log("Speedup: ", Algorithms.speedup);
  }

  updateTheme(value) {
    const index = Math.min(Math.max(value, 0), Themes.length - 1);
    this.#grid.updateTheme(Themes[index]);
  }

  mouseDown(mousePos) {
    this.#grid.startDragging(mousePos);
  }

  mouseDrag(mousePos) {
    this.#grid.drag(mousePos);
    this.#isDragging = true;
  }
  
  mouseMove(mousePos) {
    this.#grid.hover(mousePos);
  }

  mouseUp(mousePos) {
    this.#grid.endDragging(mousePos);
    if (this.#isDragging) {
      this.#isDragging = false;
    } else {
      this.click(mousePos);
    }
  }

  #update() {
    this.#resizeGLViewportIfNeeded();
    this.#draw();
    this.#increaseFpsCounter();
  }
  
  #resizeGLViewportIfNeeded(gl) {
    if (this.#shouldUpdateCanvas && (this.#now - this.#canvasSizeUpdateTime) > UPDATE_CANVAS_DELAY) {
      this.#shouldUpdateCanvas   = false;
      this.#canvasSizeUpdateTime = this.#now;
  
      const [cvw, cvh] = this.#canvasSize.values;
      const [glw, glh] = this.#canvasSize.values;
      // const [glw, glh] = this.#glContextSize.values;
      this.#gl.canvasEl.width  = cvw;
      this.#gl.canvasEl.height = cvh;
      this.#gl.canvas.width    = glw;
      this.#gl.canvas.height   = glh;
      this.#gl.viewport(0, 0, glw, glh);
      this.#grid.updateMesh(this.#cellSize, this.#canvasSize);

      const cs = this.#cellSize;
      const [nch, ncv] = this.#grid.numCells.values;
      screenSizeText.innerText = `${cvw}x${cvh} (${glw}x${glh})`;
      cellSizeText.innerText   = `${cs}x${cs}`;
      cellCountText.innerText  = `${nch}x${ncv}`;
    }
  }
  
  #increaseFpsCounter() {
    this.#now = performance.now();
    this.#deltaTime = (this.#now - this.#lastTime);
    this.#totTime += this.#deltaTime;
    this.#fpsCount++;
    if (this.#totTime >= 1000) {
      this.#totTime -= 1000;
      fpsText.innerText = this.#fpsCount;
      this.#fpsCount = 0;
    }
    this.#lastTime = this.#now;
  }
  
  #draw() {
    this.#gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
    this.#grid.draw(this.#deltaTime);
  }
}
