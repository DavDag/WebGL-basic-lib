/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class TextureConfigs the configs wrapper to use when loading textures.
 */
export class TextureConfigs {
  target;    // gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP_POSITIVE_X
  level;     // mipmap level of detail
  format;    // gl.RGBA, gl.RGB, gl.LUMINANCE, ....
  type;      // gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT_5_6_5, ...
  wrap;      // gl.REPEAT, gl.CLAMP_TO_EDGE, ...
  filter;    // gl.LINEAR, gl.NEAREST, ...
  genMipMap; // should generate mipmap ?
}

/**
 * @class Texture representing an OpenGL shader
 */
export class Texture {
  #gl;
  id;
  at;
  ref;
  
  /**
   * Creates an instance of a Texture.
   * 
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {number} id the texture id
   */
  constructor(gl, id, ref) {
    this.#gl = gl;
    this.id = id;
    this.at = undefined;
    this.ref = ref;
  }

  /**
   * Bind texture to specified unit.
   * 
   * @param {number} at the texture unit
   */
  bind(at) {
    this.at=at;
    this.#gl.activeTexture(this.#gl.TEXTURE0 + at);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.id);
  }

  /**
   * Unbind texture.
   */
  unbind() {
    this.#gl.activeTexture(this.#gl.TEXTURE0 + this.at);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, null);
    this.at=undefined;
  }

  /**
   * Delete texture.
   */
  delete() {
    this.#gl.deleteTexture(this.id);
  }

  /**
   * Create a Texture object from an Image
   * 
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {TextureConfigs} configs the texture configuration
   * @param {Image} image the texture data
   */
  static Create(gl, configs, image) {
    const id = gl.createTexture();
    gl.bindTexture(configs.target, id);
    gl.texImage2D(configs.target, configs.level, configs.format, configs.format, configs.type, image);
    if (configs.wrap) {
      gl.texParameteri(configs.target, gl.TEXTURE_WRAP_S, configs.wrap);
      gl.texParameteri(configs.target, gl.TEXTURE_WRAP_T, configs.wrap);
    }
    if (configs.filter) {
      gl.texParameteri(configs.target, gl.TEXTURE_MIN_FILTER, configs.filter.min || configs.filter);
      gl.texParameteri(configs.target, gl.TEXTURE_MAG_FILTER, configs.filter.mag || configs.filter);
    }
    if (configs.genMipMap) {
      gl.generateMipmap(configs.target);
    }
    gl.bindTexture(configs.target, null);
    return new Texture(gl, id, image);
  }

  /**
   * Creates an instance of a Texture from an url.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {string} url the url to download the texture from
   * @param {TextureConfigs} configs the texture configuration
   *
   * @return {Promise<Texture>} a promise with the texture
   */
  static FromUrl(gl, url, configs) {
    return new Promise((res, rej) => {
      const image = new Image();
      image.onload = (r) => {
        // console.log("Loaded:", image.src.split("/").at(-1), image.width, "x", image.height);
        const texture = Texture.Create(gl, configs, image);
        res(texture);
      };
      image.onerror = (event) => {
        rej("Error loading the image.");
      };
      image.crossOrigin = '';
      image.src = url;
    });
  }

  /**
   * Creates a 'fake' clone of the texture to enable 'sharing' of the underlying 'id'
   * 
   * @return {Texture} the 'clone'
   */
  clone() {
    return new Texture(this.#gl, this.id, this);
  }
}