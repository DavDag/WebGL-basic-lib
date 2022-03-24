/** @author: Davide Risaliti davdag24@gmail.com */

import {Mat4, toRad, Vec3} from "../all.js";

/**
 * @class The Camera class for common 3D scenes.
 */
export class Camera {
  #dirty=null;
  #mat=null;

  #fovy=null;
  #ratioWH=null;
  #near=null;
  #far=null;

  #pos=null;
  #dir=null;
  #up=null;

  /**
   * Constructor.
   * 
   * @param {number} fovy the FOV (on the y-axis) of the view frustom
   * @param {number} ratioWH the ratio (w / h) of the screen
   * @param {number} near the distance of the near plane
   * @param {number} far the distance of the far plane
   * @param {Vec3} pos the starting pos of the camera
   * @param {Vec3} dir the direction of the camera (relative to its position)
   * @param {Vec3} up the up vector of the camera
   */
  constructor(fovy, ratioWH, near, far, pos, dir, up) {
    this.#dirty = true;
    this.#mat = Mat4.Identity();
    this.#fovy = fovy;
    this.#ratioWH = ratioWH;
    this.#near = near;
    this.#far = far;
    this.#pos = pos;
    this.#dir = dir;
    this.#up = up;
  }
  
  /**
   * Getter to retrieve the Perspective Matrix of the camera
   * 
   * @returns {Mat4} the Perspective matrix.
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
   * Getter to retrieve the LookAt Matrix of the camera
   * 
   * @returns {Mat4} the LookAt matrix.
   */
  get lookatMat() {
    return Mat4.LookAt(
      this.#pos,
      this.#pos.clone().add(this.#dir),
      this.#up
    );
  }

  /**
   * Getter to retrieve the current matrix of the camera
   * 
   * @returns {Mat4} the combined Perspective-LookAt matrix.
   */
  get mat() {
    this.update();
    return this.#mat;
  }

  /**
   * Getter to retrieve the current position of the camera
   * 
   * @returns {Vec3} the camera position.
   */
  get position() {
    return this.#pos;
  }

  /**
   * Getter to retrieve the current direction of the camera
   * 
   * @returns {Vec3} the camera direction.
   */
  get direction() {
    return this.#dir;
  }

  /**
   * Setter to update the ratio (w / h) of the frustum
   * 
   * @param {number} value the new ratio
   */
  set ratio(value) {
    this.#ratioWH = value;
    this.#dirty = true;
  }

  /**
   * Method to check if the camera is dirty
   * 
   * @returns {boolean} the dirty flag
   */
  isDirty() {
    return this.#dirty;
  }

  /**
   * Method to update the camera
   */
  update() {
    // Check if the matrix needs to be updated.
    if (this.#dirty) {
      this.#dirty = false;
      // Recreate matrix.
      this.#mat = Mat4.Identity()
          .apply(this.perspectiveMat)
          .apply(this.lookatMat);
    }
  }

  /**
   * Method to update camera position.
   * 
   * @param {Vec3} delta the offset
   */
  movePos(delta) {
    this.#dirty = true;
    this.#pos.add(delta);
  }

  /**
   * Method to update camera direction.
   * 
   * @param {Vec3} delta the offset
   */
  moveDir(delta) {
    this.#dirty = true;
    this.#dir.add(delta);
  }
}
