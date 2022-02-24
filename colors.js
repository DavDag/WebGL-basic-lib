/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Colors wrapping color utilities
 */
export class Colors {
  
  /**
   * Convert from RGB to HSV.
   *
   * RGB values in range [0, 1]
   * SV values in range [0, 1]
   * H value in range [0, 360]
   *
   * @param {[number, number, number]} [r, g, b] the RGB input color
   * 
   * @return {[number, number, number]} [h, s, v] the HSV equivalent
   */
  static RgbToHsv([r, g, b]) {
    // Calc. cmax, cmin and delta
    const [cmax, cmin] = [Math.max(r, g, b), Math.min(r, g, b)];
    const delta = cmax - cmin;
    
    // Calc. HSV
    const v = cmax;
    const s = (cmax === 0) ? 0 : (delta / cmax);
    const h = (delta === 0) ? 0 : 60 * (
      (cmax === r) ? ((g - b)/delta) % 6 :
      (cmax === g) ? ((b - r) / delta) + 2 :
      ((r - g) / delta) + 4
    );
    
    // Result
    return [h, s, v];
  }

  /**
   * Convert from HSV to RGB.
   *
   * RGB values in range [0, 1]
   * SV values in range [0, 1]
   * H value in range [0, 360]
   *
   * @param {[number, number, number]} [h, s, v] the HSV input color
   * 
   * @return {[number, number, number]} [r, g, b] the RGB equivalent
   */
  static HsvToRgb([h, s, v]) {
    // Calc. c, x and m
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    
    // Calc. RGB
    const [r, g, b] = (
      (h <  60) ? [c, x, 0] :
      (h < 120) ? [x, c, 0] :
      (h < 180) ? [0, c, x] :
      (h < 240) ? [0, x, c] :
      (h < 300) ? [x, 0, c] :
      [c, 0, x]
    );
    
    // Result
    return [r + m, g + m, b + m];
  }
}
