import {Program, Mat4, Vec2, Vec3, Vec4, toRad} from "webgl-basic-lib";

import {programs} from "./shaders.js";

const S = 512;
const N = 256;

var isRunning = true;
var gl = null;
var textDiv = null;

const quad = {
  v: new Float32Array([
    -1, -1, 0, 1,
    -1,  1, 0, 0,
     1, -1, 1, 1,
     1,  1, 1, 0,
  ]),
  i: new Uint8Array([
    0, 1, 2,
    1, 2, 3
  ]),
};

function mmap(v) {
  const tmp = v.clone();
  tmp.div(S / 2).add(Vec2.All(-1));
  tmp.y *= -1;
  return tmp.toVec4(0, 1).transform(camera.inv()).toVec2();
}

function grid(v) {
  const tmp = v.clone();
  tmp.add(Vec2.All(1)).div(2).mul(N).floor();
  tmp.y = Math.min(Math.max(tmp.y, 0), N-1);
  tmp.x = Math.min(Math.max(tmp.x, 0), N-1);
  return tmp;
}

function bbox (v) {
  const tmp = v.clone();
  return (
       tmp.x <= 1 && tmp.x >= -1
    && tmp.y <= 1 && tmp.y >= -1
  );
}

const camera = {
  mat: null,
  invMat: null,
  updated: false,
  zoom: 0.5,
  pos: Vec2.Zeros(),
  update: function() {
    if (!this.updated) {
      this.updated = true;
      this.mat = Mat4.Identity()
        .translate(this.pos.toVec3(0))
        .scale(new Vec3(this.zoom, this.zoom, 1))
      ;
      this.invMat = this.mat.clone().inverse();
    }
  },
  curr: function () {
    this.update();
    return this.mat;
  },
  inv: function () {
    this.update();
    return this.invMat;
  },
  updatePos: function (delta) {
    this.updated = false;
    this.pos.add(delta);
  },
  updateZoom: function (delta, pos) {
    this.updated = false;
    const lastZoom = this.zoom;
    this.zoom *= Math.pow(Math.pow(2, 0.5), delta);
    this.zoom = Math.min(Math.max(0.5, this.zoom), (N / S) / (16 / S));
    const factor = this.zoom / lastZoom;
    pos.div(S / 2).add(Vec2.All(-1));
    pos.y *= -1;
    this.pos.x = pos.x - (pos.x - this.pos.x) * factor;
    this.pos.y = pos.y - (pos.y - this.pos.y) * factor;
  },
};

export const mouseHandler = {
  isDragging: false,
  isDrawing: false,
  lastPos: null,
  lastCell: null,
  onMouseDown: function (event, pos) {
    // Left
    if (event.button == 0) {
      const tmp = mmap(pos);
      if (bbox(tmp)) {
        this.isDrawing = true;
        const cell = grid(tmp);
        this.lastCell = cell.clone();
      }
    }
    // Middle
    if (event.button == 1) {
      this.isDragging = true;
      this.lastPos = pos.clone();
    }
  },
  onMouseMove: function (event, pos) {
    if (this.isDragging) {
      const delta = pos.clone().sub(this.lastPos).div(S / 2);
      delta.y *= -1;
      this.lastPos = pos.clone();
      camera.updatePos(delta);
    }
    if (this.isDrawing) {
      const tmp = mmap(pos);
      if (bbox(tmp)) {
        const cell = grid(tmp);
        this.lastCell = cell.clone();
        updateTexture(this.lastCell);
      }
    }
  },
  onMouseUp: function (event, pos) {
    // Left
    if (event.button == 0) {
      this.isDrawing = false;
      const tmp = mmap(pos);
      if (bbox(tmp)) {
        const cell = grid(tmp);
        this.lastCell = cell.clone();
        updateTexture(this.lastCell);
      }
    }
    // Middle
    if (event.button == 1) {
      this.isDragging = false;
    }
  },
  onMouseWheel: function (event, pos) {
    const delta = (event.deltaY / 100) * -1;
    camera.updateZoom(delta, pos);
  },
  onMouseOut: function (event) {
    this.isDragging = false;
    this.isDrawing = false;
  }
};

export const keyboardHandler = {
  OnKeyDown: function (event) {

  },
  OnKeyUp: function (event) {
    if (event.code == "Space") {
      isRunning = !isRunning;
      if (isRunning) {
        textDiv.innerText = "Press \"Space\" to Pause/Resume simulation";
      } else {
        textDiv.innerText = "Paused";
      }
    }
  }
}


const texture = {
  idA: null,
  idB: null,
  create: function () {
    this.idA = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.idA);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    this.idB = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.idB);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  },
  ind: 0,
  swap: function () {
    ++this.ind;
  },
  curr: function () {
    return (this.ind % 2 == 0) ? this.idA : this.idB;
  },
  next: function () {
    return (this.ind % 2 == 0) ? this.idB : this.idA;
  }
}

const cellsToUpdate = [];
function updateTexture(cell) {
  cellsToUpdate.push(cell);
  // console.log("Added: ", cell.toString(0));
}

export function main(ctx) {
  textDiv = document.getElementById("overlay-text");

  gl = ctx;
  
  const [simProgram, resProgram] = programs(gl);
  simProgram.attributes([
    ["aPos", 2, gl.FLOAT, 16, 0],
    ["aTex", 2, gl.FLOAT, 16, 8]
  ]);
  resProgram.attributes([
    ["aPos", 2, gl.FLOAT, 16, 0],
    ["aTex", 2, gl.FLOAT, 16, 8]
  ]);
  simProgram.declareUniforms([
    ["uMatrix", "Matrix4fv"],
    ["uSize", "1f"],
    ["uTexture", "1i"],
  ]);
  resProgram.declareUniforms([
    ["uMatrix", "Matrix4fv"],
    ["uSize", "1f"],
    ["uTexture", "1i"],
  ]);

  const vba = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vba);
  gl.bufferData(gl.ARRAY_BUFFER, quad.v, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quad.i, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  texture.create();
  const framebuffer = gl.createFramebuffer();
  
  simProgram.use();
  simProgram.uSize.update(N);
  resProgram.use();
  resProgram.uSize.update(N);
  Program.unbind(gl);

  function draw() {
    if (cellsToUpdate.length > 0) {      
      const pixels = new Uint8Array([255, 255, 255, 255]);
      gl.bindTexture(gl.TEXTURE_2D, texture.curr());
      cellsToUpdate.forEach((cell) => {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, cell.x, cell.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      })
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindTexture(gl.TEXTURE_2D, texture.next());
      cellsToUpdate.forEach((cell) => {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, cell.x, cell.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      })
      gl.bindTexture(gl.TEXTURE_2D, null);
      cellsToUpdate.splice(0, cellsToUpdate.length);
    }
    if (isRunning) {
      gl.viewport(0, 0, N, N);
      
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.next(), 0);
      gl.bindTexture(gl.TEXTURE_2D, texture.curr());
      
      gl.bindBuffer(gl.ARRAY_BUFFER, vba);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
      simProgram.use();

      const mat = Mat4.Identity();
      mat.scale(new Vec3(1, -1, 1));

      simProgram.uMatrix.update(mat.values);
      simProgram.uTexture.update(texture.curr());
      simProgram.enableAttributes();
      
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
      
      simProgram.disableAttributes();
      Program.unbind(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);

      texture.swap();
    }
    {
      gl.viewport(0, 0, S, S);

      gl.clearColor(0.3, 0.3, 0.3, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, texture.curr());

      gl.bindBuffer(gl.ARRAY_BUFFER, vba);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
      resProgram.use();
      resProgram.uTexture.update(texture.curr());
      
      const mat = Mat4.Identity();
      mat.apply(camera.curr());
      mat.scale(new Vec3(1, -1, 1));

      resProgram.uMatrix.update(mat.values);
      resProgram.enableAttributes();
      
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
      
      resProgram.disableAttributes();
      Program.unbind(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }
  
  const interval = setInterval(() => {
    window.requestAnimationFrame(() => {
      try {
        draw()
      } catch(e) {
        console.error(e);
        clearInterval(interval);
      }
    });
  }, 30);
}
