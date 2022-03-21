/** @author: Davide Risaliti davdag24@gmail.com */

import {Vec3, Vec4} from "../all";

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

  /**
   * Convert from Hex String to RGB.
   * The input string can contains the "#" character at the begin.
   *
   * RGB values in range [0.0, 1.0]
   *
   * @param {string} hex the Hexadecimal String input color
   * 
   * @return {Vec3} the RGB equivalent
   */
  static HexToRgb(hex) {
    // Remove # at the begin (if exists)
    hex = hex.substring(hex.indexOf("#") + 1);
  
    // Ensure hex string is of size 6
    if (hex.length != 6) throw new Error("Unsupported format");
  
    // Parse value
    const bigint = parseInt(hex, 16);
  
    // Extract components
    const r = (bigint >> 16) & 0xFF;
    const g = (bigint >>  8) & 0xFF;
    const b = (bigint >>  0) & 0xFF;

    // Return result
    return new Vec3(r, g, b).div(255);
  }

  /**
   * Convert from Hex String to RGBA.
   * The input string can contains the "#" character at the begin.
   *
   * RGBA values in range [0.0, 1.0]
   *
   * @param {string} hex the Hexadecimal String input color
   * 
   * @return {Vec4} the RGBA equivalent
   */
  static HexToRgba(hex) {
    // Remove # at the begin (if exists)
    hex = hex.substring(hex.indexOf("#") + 1);
  
    // Ensure hex string is of size 8
    if (hex.length != 8) throw new Error("Unsupported format");
  
    // Parse value
    const bigint = parseInt(hex, 16);
  
    // Extract components
    const r = (bigint >> 24) & 0xFF;
    const g = (bigint >> 16) & 0xFF;
    const b = (bigint >>  8) & 0xFF;
    const a = (bigint >>  0) & 0xFF;

    // Return result
    return new Vec4(r, g, b, a).div(255);
  }
}
