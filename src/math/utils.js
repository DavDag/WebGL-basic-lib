/** @author: Davide Risaliti davdag24@gmail.com */

const DEG_TO_RAD = Math.PI / 180.0;

/**
 * Convert from degree to radians.
 * 
 * @param {number} degree the value to convert
 * 
 * @return {number} the radians equivalent
 */
export function toRad(degree) {
  return degree * DEG_TO_RAD;
}