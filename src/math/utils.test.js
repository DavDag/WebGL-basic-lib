/** @author: Davide Risaliti davdag24@gmail.com */

import {expect, test} from '@jest/globals';
import {toRad, toDeg} from "../all";

test("toRad", () => {
  expect(toRad(0)).toBeCloseTo(0);
  expect(toRad(90)).toBeCloseTo(Math.PI / 2);
  expect(toRad(-90)).toBeCloseTo(-Math.PI / 2);
  expect(toRad(180)).toBeCloseTo(Math.PI);
  expect(toRad(-180)).toBeCloseTo(-Math.PI);
  expect(toRad(360)).toBeCloseTo(0);
});

test("toDeg", () => {
  expect(toDeg(0)).toBeCloseTo(0);
  expect(toDeg(Math.PI / 2)).toBeCloseTo(90);
  expect(toDeg(-Math.PI / 2)).toBeCloseTo(-90);
  expect(toDeg(Math.PI)).toBeCloseTo(180);
  expect(toDeg(-Math.PI)).toBeCloseTo(-180);
  expect(toDeg(Math.PI * 2)).toBeCloseTo(0);
});
