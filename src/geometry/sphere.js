/** @author: Davide Risaliti davdag24@gmail.com */

import {BasicShape, TexturedShape} from "./types.js";
import {Vec2} from "/src/math/vec2.js";
import {Vec3} from "/src/math/vec3.js";

/**
 * @class Sphere representing an Sphere.
 */
export class Sphere {
  /**
   * Creates a BasicShape of an Sphere with a user-defined precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {BasicShape} the generated sphere
   */
  static asBasicShape(precision) {
    const { verteces, uvs, elements } = Sphere.#buildSphere(precision);
    return new BasicShape(verteces, elements);
  }
  
  /**
   * Creates a TexturedShape of a Sphere with a user-defined precision.
   *
   * @param {number} precision the precision to use when
   *                 generating the shape
   *
   * @return {TexturedShape} the generated sphere
   */
  static asTexturedShape(precision) {
    const { verteces, uvs, elements } = Sphere.#buildSphere(precision);
    return new TexturedShape(verteces, uvs, elements);
  }

  static #buildSphere(precision) {
    precision = Math.max(0, precision);
    const nstacks = precision + 5;
    const nslices = precision + 5;
    
    const verteces = [];
    const elements = [];
    const uvs = [];
    
    const v0 = verteces.push(new Vec3(0, 1, 0)) - 1;
    uvs.push(new Vec3(0, 1, 0).toUVofSphere());
  
    for (let i = 0; i < nstacks - 1; ++i) {
      const phi = Math.PI * (i + 1) / nstacks;
      for (let j = 0; j < nslices; ++j) {
        const theta = 2.0 * Math.PI * j / nslices;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        verteces.push(new Vec3(x, y, z));
        uvs.push(new Vec3(x, y, z).toUVofSphere());
      }
    }
  
    const v1 = verteces.push(new Vec3(0, -1, 0)) - 1;
    uvs.push(new Vec3(0, -1, 0).toUVofSphere());
  
    for (let i = 0; i < nslices; ++i) {
      var i0 = i + 1;
      var i1 = (i + 1) % nslices + 1;
      elements.push(new Vec3(v0, i1, i0));
      i0 = i + nslices * (nstacks - 2) + 1;
      i1 = (i + 1) % nslices + nslices * (nstacks - 2) + 1;
      elements.push(new Vec3(v1, i0, i1));
    }
  
    for (let j = 0; j < nstacks - 2; ++j) {
      const j0 = j * nslices + 1;
      const j1 = (j + 1) * nslices + 1;
      for (let i = 0; i < nslices; ++i) {
        const i0 = j0 + i;
        const i1 = j0 + (i + 1) % nslices;
        const i2 = j1 + (i + 1) % nslices;
        const i3 = j1 + i;
        elements.push(new Vec3(i0, i1, i2));
        elements.push(new Vec3(i0, i2, i3));
      }
    }

    var [min, max] = [1, 0];
    uvs.forEach((v, ind) => {
      if (v.x < min) {
        min = v.x;
      }
      if (v.x > max) {
        max = v.x;
      }
    });

    [min, max] = [min.toFixed(4), max.toFixed(4)];

    elements.forEach((face) => {
      const uvA = uvs[face.x];
      const uvB = uvs[face.y];
      const uvC = uvs[face.z];
      const vecA = verteces[face.x];
      const vecB = verteces[face.y];
      const vecC = verteces[face.z];

      if (uvA.x.toFixed(4) == min) {
        if (uvB.x.toFixed(4) == max || uvC.x.toFixed(4) == max) {
          const newA = verteces.push(vecA.clone()) - 1;
          uvs.push(new Vec2(1, uvA.y));
          face.x = newA;
        }
      }

      if (uvB.x.toFixed(4) == min) {
        if (uvA.x.toFixed(4) == max || uvC.x.toFixed(4) == max) {
          const newB = verteces.push(vecB.clone()) - 1;
          uvs.push(new Vec2(1, uvB.y));
          face.y = newB;
        }
      }

      if (uvC.x.toFixed(4) == min) {
        if (uvA.x.toFixed(4) == max || uvB.x.toFixed(4) == max) {
          const newC = verteces.push(vecC.clone()) - 1;
          uvs.push(new Vec2(1, uvC.y));
          face.z = newC;
        }
      }
    });

    return { verteces, elements, uvs };
  }
}