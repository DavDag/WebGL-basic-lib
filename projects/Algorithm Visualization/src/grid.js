/** @author: Davide Risaliti davdag24@gmail.com */

import {Debug, Colors, Shader, Program, Vec2, Vec3, Vec4, Mat2, Mat4} from "webgl-basic-lib";

const V_SH_SRC = 
`
attribute vec4 aPosition;
attribute float aInd;
attribute float aType;
attribute float aLastType;
attribute float aTime;

varying vec2 vRelPos;
varying float vType;
varying float vLastType;
varying float vTime;

uniform float uTime;

vec2 getRelPos(vec2[4] pos, int index) {
  for (int i = 0; i < 4; ++i)
    if (i == index)
      return pos[i];
}

void main(void) {
  vec2 POSITIONS[4];
  POSITIONS[0] = vec2(0, 0);
  POSITIONS[1] = vec2(0, 1);
  POSITIONS[2] = vec2(1, 0);
  POSITIONS[3] = vec2(1, 1);

  vType     = aType;
  vLastType = aLastType;
  vRelPos   = getRelPos(POSITIONS, int(aInd));
  vTime     = uTime - aTime;

  gl_Position = aPosition;
}
`;

const F_SH_SRC = 
`
precision mediump float;

struct TypeData {
  vec3 back_c;
  vec3 bord_c;
  float bord_s;
  float anim_t;
};
uniform TypeData uTypeData[6];

varying vec2 vRelPos;
varying float vType;
varying float vLastType;
varying float vTime;

TypeData getData(TypeData[6] data, int index) {
  for (int i = 0; i < 6; ++i)
    if (i == index)
      return data[i];
}

void main(void) {
  int index     = int(vType);
  int lastIndex = int(vLastType);

  TypeData data     = getData(uTypeData, index);
  TypeData lastData = getData(uTypeData, lastIndex);

  float perc     = clamp(vTime / data.anim_t, 0.0, 1.0);

  vec3 bordColor = mix(lastData.bord_c, data.bord_c, perc);
  vec3 backColor = mix(lastData.back_c, data.back_c, perc);
  float border   = mix(lastData.bord_s, data.bord_s, perc);

  if (vRelPos.x <= border || vRelPos.x >= (1.0 - border)
   || vRelPos.y <= border || vRelPos.y >= (1.0 - border)) {
    gl_FragColor = vec4(bordColor, 1.0);
  } else {
    gl_FragColor = vec4(backColor, 1.0);
  }

  // gl_FragColor = vec4(perc, perc, perc, 1.0);
}
`;

const MAX_GRID_DATA = 100;

const UN_EXPLORED_INDEX = 0;
const EXPLORED_INDEX    = 1;
const WALL_INDEX        = 2;
const START_INDEX       = 3;
const END_INDEX         = 4;
const PATH_INDEX        = 5;

export class Grid {
  #gl;
  
  #program;

  #abuffer;
  #ebuffer;
  #indices;

  #cellSize;
  #screenSize;

  numCells;

  sp;
  ep;
  walls;

  static #DefConfigs = [
    // UN_EXPLORED_INDEX
    {
      back_c: new Vec3(1,0,0),
      bord_c: new Vec3(1,0,0),
      bord_s: 1,
      anim_t: 300,
    },
    // EXPLORED_INDEX
    {
      back_c: new Vec3(0,1,0),
      bord_c: new Vec3(0,1,0),
      bord_s: 1,
      anim_t: 200,
    },
    // WALL_INDEX
    {
      back_c: new Vec3(0,0,1),
      bord_c: new Vec3(0,0,1),
      bord_s: 1,
      anim_t: 300,
    },
    // START_INDEX
    {
      back_c: new Vec3(1,1,0),
      bord_c: new Vec3(1,1,0),
      bord_s: 3,
      anim_t: 100,
    },
    // END_INDEX
    {
      back_c: new Vec3(0,1,1),
      bord_c: new Vec3(0,1,1),
      bord_s: 3,
      anim_t: 100,
    },
    // PATH_INDEX
    {
      back_c: new Vec3(1,0,1),
      bord_c: new Vec3(1,0,1),
      bord_s: 1,
      anim_t: 1000,
    }
  ];
  #configs;

  #data;

  #isBuilding;
  #selectedType;
  #lastSelectedPos;
  #lastSelectedType;

  #canEdit;
  #shouldUpdate;
  
  constructor(gl) {
    this.#gl = gl;

    this.sp    = new Vec2(1, 1);
    this.ep    = new Vec2(3, 3);
    this.walls = [];

    const now = performance.now();

    this.#data = [];
    for (let i = 0; i < MAX_GRID_DATA; ++i) {
      this.#data[i] = [];
      for (let j = 0; j < MAX_GRID_DATA; ++j) {
        this.#data[i][j] = {
          last: UN_EXPLORED_INDEX,
          type: UN_EXPLORED_INDEX,
          time: now
        };
      }
    }
    this.#data[this.sp.x][this.sp.y].type = START_INDEX;
    this.#data[this.ep.x][this.ep.y].type = END_INDEX;

    this.#shouldUpdate = false;
    
    const vshader = new Shader(gl, gl.VERTEX_SHADER, V_SH_SRC);
    const fshader = new Shader(gl, gl.FRAGMENT_SHADER, F_SH_SRC);

    this.#program = new Program(gl);
    this.#program.attachShader(vshader);
    this.#program.attachShader(fshader);
    this.#program.attributes([
      ["aPosition", 2, gl.FLOAT, 24,  0],
      ["aInd"     , 1, gl.FLOAT, 24,  8],
      ["aType"    , 1, gl.FLOAT, 24, 12],
      ["aLastType", 1, gl.FLOAT, 24, 16],
      ["aTime"    , 1, gl.FLOAT, 24, 20]
    ]);
    this.#program.link();

    const uniforms = Array(6).fill(null).map((_, ind) => {
      return [
        [`uTypeData[${ind}].back_c`, "3fv"],
        [`uTypeData[${ind}].bord_c`, "3fv"],
        [`uTypeData[${ind}].bord_s`, "1f"],
        [`uTypeData[${ind}].anim_t`, "1f"],
      ];
    }).flat();
    this.#program.declareUniforms([
      ["uTime", "1f"],
      ...uniforms
    ]);
    
    this.#abuffer = gl.createBuffer();
    this.#ebuffer = gl.createBuffer();
    
    this.#cellSize   = 0;
    this.#screenSize = Vec2.Zeros();
    this.numCells    = Vec2.Zeros();

    this.updateMesh(50, new Vec2(800, 600));

    this.#configs = Grid.#DefConfigs;
    this.#applyTheme();

    this.#canEdit          = true;
    this.#isBuilding       = false;
    this.#selectedType     = -1;
    this.#lastSelectedPos  = Vec2.All(-1);
    this.#lastSelectedType = -1;
  }

  updateTheme(theme) {
    // console.log(theme);
    ["unexp", "exp", "wall", "start", "end", "path"].forEach((n, ind) => {
      const key_f = n + "_f";
      const key_b = n + "_b";
      // console.log(theme[key_f], theme[key_b]);
      this.#configs[ind].back_c = theme[key_f];
      this.#configs[ind].bord_c = theme[key_b];
    });
    // console.log(this.#configs);
    this.#applyTheme();
  }

  #applyTheme() {
    if (!this.#configs) return;
    this.#program.use();
    this.#configs.forEach((config, ind) => {
      this.#program[`uTypeData[${ind}].back_c`].update(config.back_c.values);
      this.#program[`uTypeData[${ind}].bord_c`].update(config.bord_c.values);
      this.#program[`uTypeData[${ind}].bord_s`].update((config.bord_s / this.#cellSize));
      this.#program[`uTypeData[${ind}].anim_t`].update(config.anim_t);
    });
    this.#program.unbind(this.#gl);
    this.#shouldUpdate = true;
  }

  updateMesh(cellSize, screenSize) {
    this.#cellSize = cellSize;
    this.#screenSize = screenSize;
    this.#updateMesh();
    this.#applyTheme();
  }

  #updateMesh() {
    const gl = this.#gl;
    
    const quad = {
      v: [new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1)],
      i: [new Vec3(0,1,2), new Vec3(1,2,3)]
    };

    this.#indices  = [];

    this.numCells.x = Math.floor(this.#screenSize.w / this.#cellSize) + 1;
    this.numCells.y = Math.floor(this.#screenSize.h / this.#cellSize) + 1;
    
    this.numCells.x = Math.max(Math.min(this.numCells.x, MAX_GRID_DATA), 0);
    this.numCells.y = Math.max(Math.min(this.numCells.y, MAX_GRID_DATA), 0);

    const norm = this.#screenSize.clone().inverse().toVec3(1);
    const size = new Vec3(this.#cellSize, this.#cellSize, 1);
    
    let index = 0;
    for (let x = 0; x < this.numCells.x; ++x) {
      for (let y = 0; y < this.numCells.y; ++y) {
        const mat = Mat4.Identity()
          .scale(new Vec3(2, -2, 1))
          .translate(new Vec3(-0.5, -0.5, 0))
          .scale(norm)
          .scale(size)
          .translate(new Vec3(x, y, 0));
        
        this.#data[y][x].verteces = [];
        quad.v.map((v, ind) => {
          const vec = v.toVec4(0, 1).transform(mat);
          const pos = vec.toVec2();
          this.#data[y][x].verteces.push({pos, ind});
        });
        
        const beg = Vec3.All(index);
        index += 4;
        this.#indices.push(...quad.i.map((v) => v.clone().add(beg)));
      }
    }

    this.#shouldUpdate = true;
  }

  #uploadChanges() {
    // console.log("Detected changes...");
    
    const gl = this.#gl;

    const verteces = [];
    for (let x = 0; x < this.numCells.x; ++x) {
      for (let y = 0; y < this.numCells.y; ++y) {
        const type = this.#data[y][x].type;
        const last = this.#data[y][x].last;
        const time = this.#data[y][x].time;
        this.#data[y][x].verteces.forEach(
          ({pos, ind}) =>
            verteces.push(...pos.values, ind, type, last, time)
        );
      }
    }
    const vertecesData = new Float32Array(verteces);
    const indicesData = new Uint16Array(this.#indices.map((v) => [...v.values]).flat());
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#abuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertecesData, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#ebuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesData, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  draw() {
    const gl = this.#gl;

    if (this.#shouldUpdate) {
      this.#uploadChanges();
      this.#shouldUpdate = false;
    }
    
    gl.enable(gl.DEPTH_TEST);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#abuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#ebuffer);

    this.#program.use();
    this.#program.enableAttributes();

    const now = performance.now();
    this.#program.uTime.update(now);

    gl.drawElements(gl.TRIANGLES, this.numCells.x * this.numCells.y * 6, gl.UNSIGNED_SHORT, 0);

    this.#program.disableAttributes();
    this.#program.unbind(gl);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.disable(gl.DEPTH_TEST);
  }

  clear() {
    const now = performance.now();
    
    for (let i = 0; i < MAX_GRID_DATA; ++i) {
      for (let j = 0; j < MAX_GRID_DATA; ++j) {
        this.#data[i][j].last = UN_EXPLORED_INDEX;
        this.#data[i][j].type = UN_EXPLORED_INDEX;
        this.#data[i][j].time = now;
      }
    }
    
    this.#updateCellType(this.sp, START_INDEX);
    this.#updateCellType(this.ep, END_INDEX);

    this.walls.forEach((w) => this.addWall(w));
  }
  
  reset() {
    this.sp    = new Vec2(1, 1);
    this.ep    = new Vec2(3, 3);
    this.walls = [];
    this.clear();
  }

  disableEditing() {
    this.#canEdit = false;
  }

  enableEditing() {
    this.#canEdit = true;
  }

  #mouseToCell(mousePos) {
    const x = Math.floor(mousePos.x / this.#cellSize);
    const y = Math.floor(mousePos.y / this.#cellSize);
    const pos = new Vec2(x, y);
    return pos;
  }

  #updateCellType(pos, newType) {
    const now = performance.now();
    
    this.#data[pos.y][pos.x].last = this.#data[pos.y][pos.x].type;
    this.#data[pos.y][pos.x].time = now;
    this.#data[pos.y][pos.x].type = newType;

    this.#shouldUpdate = true;
  }

  click(mousePos) {
    if (!this.#canEdit) return;
    const pos = this.#mouseToCell(mousePos);
    this.toggleWall(pos);
  }
  
  startDragging(mousePos) {
    if (!this.#canEdit) return;
    const pos = this.#mouseToCell(mousePos);
    this.#selectedType     = this.#data[pos.y][pos.x].type;
    this.#lastSelectedPos  = pos;
    this.#lastSelectedType = UN_EXPLORED_INDEX;
    this.#isBuilding       = this.#selectedType === UN_EXPLORED_INDEX
                          || this.#selectedType === WALL_INDEX;
    if (this.#isBuilding) this.#lastSelectedPos = Vec2.All(-1);
  }

  drag(mousePos) {
    if (!this.#canEdit) return;
    const pos = this.#mouseToCell(mousePos);
    if (!this.#lastSelectedPos.equals(pos) && this.isInBounds(pos)) {
      if (!this.#isBuilding) {
        this.#data[this.#lastSelectedPos.y][this.#lastSelectedPos.x].type = this.#lastSelectedType;
        this.#lastSelectedPos         = pos;
        this.#lastSelectedType        = this.#data[pos.y][pos.x].type;
        this.#data[pos.y][pos.x].type = this.#selectedType;
        if (this.#selectedType === START_INDEX) this.sp = pos;
        if (this.#selectedType === END_INDEX)   this.ep = pos;
        this.#shouldUpdate = true;
      } else {
        this.#lastSelectedPos = pos;
        this.toggleWall(pos);
      }
    }
  }

  hover(mousePos) {
    const pos = this.#mouseToCell(mousePos);
    // TODO
  }

  endDragging(mousePos) {
    if (!this.#canEdit) return;
    const pos = this.#mouseToCell(mousePos);
    if (this.#lastSelectedType === WALL_INDEX) {
      this.walls = this.walls.filter((v) => !v.equals(pos));
    }
  }

  toggleWall(pos) {
    if (this.isInBounds(pos) && !this.sp.equals(pos) && !this.ep.equals(pos)) {
      if (this.isWall(pos)) {
        this.remWall(pos);
      } else {
        this.addWall(pos);
      }
    }
  }

  addWall(pos) {
    // console.log("Adding wall at: ", pos.toString(0));
    this.#updateCellType(pos, WALL_INDEX);
    this.walls.push(pos);
  }

  remWall(pos) {
    // console.log("Removing wall at: ", pos.toString(0));
    this.#updateCellType(pos, UN_EXPLORED_INDEX);
    this.walls = this.walls.filter((v) => !v.equals(pos));
  }

  isInBounds(pos) {
    return pos.x >= 0 && pos.y >= 0
      && pos.x < this.numCells.x && pos.y < this.numCells.y
      && pos.x < MAX_GRID_DATA && pos.y < MAX_GRID_DATA;
  }

  isVisited(pos) {
    return this.#data[pos.y][pos.x].type === EXPLORED_INDEX;
  }

  isWall(pos) {
    return this.#data[pos.y][pos.x].type === WALL_INDEX;
  }

  setVisited(pos) {
    this.#updateCellType(pos, EXPLORED_INDEX);
  }

  setPath(arr) {
    arr.forEach((pos) => this.#updateCellType(pos, PATH_INDEX));
  }
}
