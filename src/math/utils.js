/** @author: Davide Risaliti davdag24@gmail.com */

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

/**
 * Convert from degrees to radians.
 * 
 * @param {number} degrees the value to convert
 * 
 * @return {number} the radians equivalent
 */
export function toRad(degrees) {
  return (degrees % 360) * DEG_TO_RAD;
}

/**
 * Convert from radians to degrees.
 * 
 * @param {number} radians the value to convert
 * 
 * @return {number} the radians equivalent
 */
export function toDeg(radians) {
  return (radians * RAD_TO_DEG) % 360;
}
