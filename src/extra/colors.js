/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec3} from "../all";

/**
 * @class Colors wrapping color utilities
 */
export class Colors {
  
  /**
   * Convert from RGB to HSV.
   *
   * RGB values in range [0.0, 1.0]
   * HSV values in range [0.0, 1.0]
   *
   * @param {Vec3} col the RGB input color
   * 
   * @return {Vec3} the HSV equivalent
   */
  static RgbToHsv(col) {
    // Unpack
    const [r, g, b] = [col.r, col.g, col.b];

    // Calc cmin, cmax and delta
    const cmax = Math.max(r, g, b)
    const cmin = Math.min(r, g, b);
    const delta = cmax - cmin;
    
    // Calc HSV components
    const v = cmax;
    const s = (cmax === 0) ? 0 : (delta / cmax);
    var h = 0;
    if (delta !== 0) {
      if (cmax === r) {
        h = ((g - b) / delta) % 6;
      }
      else if (cmax === g) {
        h = ((b - r) / delta) + 2;
      }
      else {
        h = ((r - g) / delta) + 4;
      }
      h *= (1.0 / 6.0);
      if (h < 0.0) h += 1.0;
    }
    
    // Result
    return new Vec3(h, s, v);
  }

  /**
   * Convert from HSV to RGB.
   *
   * RGB values in range [0.0, 1.0]
   * HSV values in range [0.0, 1.0]
   *
   * @param {Vec3} col the HSV input color
   * 
   * @return {Vec3} the RGB equivalent
   */
  static HsvToRgb(col) {
    // Unpack
    const [h, s, v] = [col.h * 360, col.s, col.v];

    // Calc c, x and m
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    
    // Calc RGB components
    const [r, g, b] = (
      (h <  60) ? [c, x, 0] :
      (h < 120) ? [x, c, 0] :
      (h < 180) ? [0, c, x] :
      (h < 240) ? [0, x, c] :
      (h < 300) ? [x, 0, c] :
      [c, 0, x]
    );
    
    // Result
    return new Vec3(r + m, g + m, b + m);
  }
}
