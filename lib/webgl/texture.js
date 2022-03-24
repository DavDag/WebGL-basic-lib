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
  
  /**
   * Creates an instance of a Texture.
   * 
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {number} id the texture id
   */
  constructor(gl, id) {
    this.#gl = gl;
    this.id = id;
  }

  /**
   * Bind texture to specified unit.
   * 
   * @param {number} at the texture unit
   */
  bind(at) {
    this.#gl.activeTexture(this.#gl.TEXTURE0 + at);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.id);
  }

  /**
   * Unbind texture.
   * 
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {number} at the texture unit
   */
  static Unbind(gl, at) {
    gl.activeTexture(gl.TEXTURE0 + at);
    gl.bindTexture(gl.TEXTURE_2D, null);
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
      gl.texParameteri(configs.target, gl.TEXTURE_MIN_FILTER, configs.filter);  
      gl.texParameteri(configs.target, gl.TEXTURE_MAG_FILTER, configs.filter);
    }
    if (configs.genMipMap) {
      gl.generateMipmap(configs.target);
    }
    gl.bindTexture(configs.target, null);
    return new Texture(gl, id);
  }

  /**
   * Creates an instance of a Texture from an url.
   *
   * @param {WebGLRenderingContext} gl the WebGL context
   * @param {string} url the url to download the texture from
   * @param {{wrap: GL_ENUM, filter: GL_ENUM, genMipMap: boolean}} configs the texture configuration
   *
   * @return {Promise<Texture>} a promise with the texture
   */
  static FromUrl(gl, url, configs) {
    return new Promise((res, rej) => {
      const image = new Image();
      image.onload = () => {
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
}