import {Vec2} from "webgl-basic-lib";

function sleep(ms) {
  if (Algorithms.speedup == 0) return;
  ms = ms / Algorithms.speedup;
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
}
      
const UP    = new Vec2( 0, -1);
const RIGHT = new Vec2( 1,  0);
const DOWN  = new Vec2( 0,  1);
const LEFT  = new Vec2(-1,  0);

export class Algorithms {

  static speedup = 1.0;

  static async bfs(grid, sPos, ePos) {
    
    const mp = {};
    const insert = (p, from) => {
      const k = p.x + "_" + p.y;
      if (!mp[k]) mp[k] = from;
    };
    const retrieve = (p) => {
      const k = p.x + "_" + p.y;
      return mp[k];
    }

    const queue    = [sPos];
    const solution = [];
    
    insert(sPos, null);

    while (queue.length > 0) {
      const pos = queue.shift(1);

      if (grid.isVisited(pos)) continue;      
      grid.setVisited(pos);

      await sleep(50);

      if (pos.equals(ePos)) {
        solution.push(pos);
        let f = retrieve(pos);
        let it = 0;
        while (f != null && ++it <= 10000) {
          solution.push(f);
          f = retrieve(f);
        }
        break;
      }
      
      const up    = pos.clone().add(UP);
      const right = pos.clone().add(RIGHT);
      const down  = pos.clone().add(DOWN);
      const left  = pos.clone().add(LEFT);

      [up, right, down, left]
        .forEach((d) => {
          if (grid.isInBounds(d) && !grid.isVisited(d) && !grid.isWall(d)) {
            queue.push(d);
            insert(d, pos.clone());
          }
        });
    }
    grid.setPath(solution);
  }

  static async dfs(grid, sPos, ePos) {

    const solution = [];
    
    async function dfs_ric(pos) {
      if (grid.isVisited(pos)) return false;
      grid.setVisited(pos);

      await sleep(50);

      if (pos.equals(ePos)) {
        solution.push(pos);
        return true;
      }
      
      const up    = pos.clone().add(UP);
      const right = pos.clone().add(RIGHT);
      const down  = pos.clone().add(DOWN);
      const left  = pos.clone().add(LEFT);

      const pref = [up, right, down, left];

      for (let d of pref) {
        if (grid.isInBounds(d) && !grid.isVisited(d) && !grid.isWall(d)) {
          const res = await dfs_ric(d);
          if (res) {
            solution.push(pos);
            return true;
          }
        }
      }
    };

    await dfs_ric(sPos);
    grid.setPath(solution);
  }
}
