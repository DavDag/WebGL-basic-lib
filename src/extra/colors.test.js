/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Colors, Vec3, Vec4} from "../all";

const a = [
  // Single channel
  [[255,   0,   0], [  0, 100, 100]],
  [[  0, 255,   0], [120, 100, 100]],
  [[  0,   0, 255], [240, 100, 100]],

  // Multiple channel
  [[255, 255, 255], [  0,   0, 100]],
  [[  0, 255, 255], [180, 100, 100]],
  [[255,   0, 255], [300, 100, 100]],
  [[255, 255,   0], [ 60, 100, 100]],
  [[  0,   0,   0], [  0,   0,   0]],

  // Partial
  [[ 32,  64,  96], [210,  67,  38]],
  [[ 96,  64,  32], [ 30,  67,  38]],
  [[128, 196, 128], [120,  35,  77]],
];

const aa = a.map(([[r, g, b], [h, s, v]]) => {
  const vRgb = new Vec3(r / 255, g / 255, b / 255);
  const vHsv = new Vec3(h / 360, s / 100, v / 100);
  return [vRgb, vHsv];
});

test("RgbToHsv", () => {
  aa.forEach(([rgb, hsv], ind) => {
    expect(global.CmpVecToVec(
      Colors.RgbToHsv(rgb).round(2),
      hsv.clone().round(2)
    )).toBe(true);
  });
});

test("HsvToRgb", () => {
  aa.forEach(([rgb, hsv], ind) => {
    expect(global.CmpVecToVec(
      Colors.HsvToRgb(hsv).round(2),
      rgb.clone().round(2)
    )).toBe(true);
  });
});

const b = [
  // Single channel (with and without '#')
  ["#FF0000", [255,   0,   0]],
  ["#00FF00", [  0, 255,   0]],
  ["#0000FF", [  0,   0, 255]],
  ["FF0000" , [255,   0,   0]],
  ["00FF00" , [  0, 255,   0]],
  ["0000FF" , [  0,   0, 255]],

  // Mixed
  ["#8AA139", [138, 161,  57]],
  ["#0ADBBB", [ 10, 219, 187]],
  ["#B7AFF1", [183, 175, 241]],
  ["#3D2F36", [ 61,  47,  54]],
];

test("HexToRgb", () => {
  b.forEach(([hex, [r, g, b]]) => {
    const rgb = new Vec3(r, g, b).div(255);
    const expected = Colors.HexToRgb(hex);
    expect(global.CmpVecToVec(expected, rgb)).toBe(true);
  });
});

const c = [
  // Single channel (with and without '#')
  ["#FF0000FF", [255,   0,   0, 255]],
  ["#00FF00FF", [  0, 255,   0, 255]],
  ["#0000FFFF", [  0,   0, 255, 255]],
  ["FF0000FF" , [255,   0,   0, 255]],
  ["00FF00FF" , [  0, 255,   0, 255]],
  ["0000FFFF" , [  0,   0, 255, 255]],

  // Mixed
  ["#8AA13980", [138, 161,  57, 128]],
  ["#0ADBBB40", [ 10, 219, 187,  64]],
  ["#B7AFF19A", [183, 175, 241, 154]],
  ["#3D2F360C", [ 61,  47,  54,  12]],
];

test("HexToRgba", () => {
  c.forEach(([hex, [r, g, b, a]]) => {
    const rgb = new Vec4(r, g, b, a).div(255);
    const expected = Colors.HexToRgba(hex);
    expect(global.CmpVecToVec(expected, rgb)).toBe(true);
  });
});
