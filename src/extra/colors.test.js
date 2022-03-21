/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {Colors, Vec3} from "../all";

const d = [
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

const dd = d.map(([[r, g, b], [h, s, v]]) => {
  const vRgb = new Vec3(r / 255, g / 255, b / 255);
  const vHsv = new Vec3(h / 360, s / 100, v / 100);
  return [vRgb, vHsv];
});

test("RgbToHsv", () => {
  dd.forEach(([rgb, hsv], ind) => {
    expect(global.CmpVecToVec(
      Colors.RgbToHsv(rgb).round(2),
      hsv.clone().round(2)
    )).toBe(true);
  });
});

test("HsvToRgb", () => {
  dd.forEach(([rgb, hsv], ind) => {
    expect(global.CmpVecToVec(
      Colors.HsvToRgb(hsv).round(2),
      rgb.clone().round(2)
    )).toBe(true);
  });
});
