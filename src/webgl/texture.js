/** @author: Davide Risaliti davdag24@gmail.com */

/**
 * @class Texture representing an OpenGL shader
 */
export class Texture {
  /**
   * Creates an instance of a Texture.
   */
  constructor(gl, id, image) {
    this.gl = gl;
    this.id = id;
    this.image = image;
    this.level = 0;
    this.internalFormat = gl.RGBA;
    this.srcFormat = gl.RGBA;
    this.srcType = gl.UNSIGNED_BYTE;
  }

  /**
   *
   */
  load() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      this.level,
      this.internalFormat,
      this.srcFormat,
      this.srcType,
      this.image
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  /**
   *
   */
  bind() {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }

  /**
   * Creates an instance of a Texture from an url.
   *
   * @param {string} url the url to download the texture from
   *
   * @return {Promise<Texture>} a promise with the texture
   */
  static fromUrl(gl, url) {
    return new Promise((res, rej) => {
      const image = new Image();
      image.onload = () => {
        const texture = gl.createTexture();
        res(new Texture(gl, texture, image));
      };
      image.crossOrigin = '';
      image.src = url;
    });
  }
}