/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat4, toRad} from "../all.js";

/**
 * @class 
 */
export class Camera {
  #dirty=null;
  #mat=null;

  #fovy=null;
  #ratioWH=null;
  #near=null;
  #far=null;

  #pos=null;
  #target=null;
  #up=null;

  /**
   * 
   */
  constructor(fovy, ratioWH, near, far, pos, target, up) {
    this.#dirty = true;
    this.#mat = Mat4.Identity();
    this.#fovy = fovy;
    this.#ratioWH = ratioWH;
    this.#near = near;
    this.#far = far;
    this.#pos = pos;
    this.#target = target;
    this.#up = up;
  }
  
  /**
   * 
   */
  get perspectiveMat() {
    return Mat4.Perspective(
      toRad(this.#fovy),
      this.#ratioWH,
      this.#near,
      this.#far
    );
  }

  /**
   * 
   */
  get lookatMat() {
    return Mat4.LookAt(
      this.#pos,
      this.#pos.clone().add(this.#target),
      this.#up
    );
  }

  /**
   * 
   */
  get mat() {
    if (this.#dirty) {
      this.#dirty = false;
      this.#mat = Mat4.Identity()
        .apply(this.perspectiveMat)
        .apply(this.lookatMat);
    }
    return this.#mat;
  }

  /**
   * 
   */
  set ratio(value) {
    this.#ratioWH = value;
    this.#dirty = true;
  }

  /**
   * 
   */
  move(delta) {
    this.#dirty = true;
    this.#pos.add(delta);
  }
}
