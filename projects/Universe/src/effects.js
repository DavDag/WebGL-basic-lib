/** @author: Davide Risaliti davdag24@gmail.com */

import { Mat4, Program, Quad, Shader, Texture, TexturedShape, Vec3 } from "webgl-basic-lib";

export class Effects {
  ctx;
  quad;
  invertFB=null;
  framebuffers={
    scene:{id:null,colorTex:null,depthTex:null},
    bloom:{id:null,colorTex:null,},
  };
  programs={
    fbBlit:null,
    bloom:null,
  };

  static V_SHADER_FB_BLIT =
  `
  precision mediump float;
  attribute vec2 aPos;
  attribute vec2 aTex;
  uniform mat4 uMatrix;
  varying vec2 vTex;
  void main() {
    vTex = aTex;
    gl_Position = uMatrix * vec4(aPos, 0, 1);
  }
  `;

  static F_SHADER_FB_BLIT = 
  `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uExposure;
  varying vec2 vTex;
  void main() {
    vec4 col = texture2D(uTexture, vTex);
    vec3 res = col.rgb;

    // exposure tone mapping
    vec3 hdr = col.rgb;
    res = vec3(1.0) - exp(-hdr * uExposure);

    // gamma correction 
    const float gamma = 2.2;
    res = pow(res, vec3(1.0 / gamma));
  
    gl_FragColor = vec4(res, 1.0);
  }
  `;

  static V_SHADER_BLOOM =
  `
  precision mediump float;
  attribute vec2 aPos;
  attribute vec2 aTex;
  uniform mat4 uMatrix;
  varying vec2 vTex;
  void main() {
    vTex = aTex;
    gl_Position = uMatrix * vec4(aPos, 0, 1);
  }
  `;

  static F_SHADER_BLOOM = 
  `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uForce;
  varying vec2 vTex;
  void main() {
    vec4 col = texture2D(uTexture, vTex);

    // float bright = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    // if (bright >= 1.0) {
    //   gl_FragColor = vec4(col.rgb, 1.0);
    // }
    // else {
    //   gl_FragColor = vec4(vec3(0.25), 1.0);
    // }

    gl_FragColor = col;
  }
  `;

  constructor(gl) {
    this.ctx = gl;
    this.quad = Quad.asTexturedShape().createBuffers(gl);
    this.invertFB = Mat4.Identity().scale(new Vec3(1, -1, 1));
    // ========= FB BLIT PROGRAM ============
    {
      const program = new Program(gl);
      program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Effects.V_SHADER_FB_BLIT));
      program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Effects.F_SHADER_FB_BLIT));
      program.attributes([
        ["aPos", 3, gl.FLOAT, 4 * TexturedShape.VertexSize(),  0],
        ["aTex", 2, gl.FLOAT, 4 * TexturedShape.VertexSize(), 12],
      ]);
      program.link();
      program.declareUniforms([
        ["uMatrix", "Matrix4fv"],
        ["uTexture", "1i"],
        ["uExposure", "1f"],
      ]);
      program.use();
      program.uTexture.update(0);
      program.uMatrix.update(this.invertFB.values);
      program.unbind();
      this.programs.fbBlit = program;
    }
    // ========= BLOOM PROGRAM ============
    {
      const program = new Program(gl);
      program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Effects.V_SHADER_BLOOM));
      program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Effects.F_SHADER_BLOOM));
      program.attributes([
        ["aPos", 3, gl.FLOAT, 4 * TexturedShape.VertexSize(),  0],
        ["aTex", 2, gl.FLOAT, 4 * TexturedShape.VertexSize(), 12],
      ]);
      program.link();
      program.declareUniforms([
        ["uMatrix", "Matrix4fv"],
        ["uTexture", "1i"],
        ["uForce", "1f"],
      ]);
      program.use();
      program.uTexture.update(0);
      program.uMatrix.update(this.invertFB.values);
      program.unbind();
      this.programs.bloom = program;
    }
    // ==============================================
    this.framebuffers.scene.id = gl.createFramebuffer();
    this.framebuffers.bloom.id = gl.createFramebuffer();
  }

  updateFB() {
    const gl = this.ctx;
    const w = gl.canvas.width;
    const h = gl.canvas.height;
    function createColorTex() {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return new Texture(gl, tex, null);
    }
    function createDepthTex() {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, w, h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindTexture(gl.TEXTURE_2D, null);      
      return new Texture(gl, tex, null);
    }
    Object.values(this.framebuffers).forEach((fbo) => {
      if (fbo.colorTex) { fbo.colorTex.delete(); }
      if (fbo.depthTex) { fbo.depthTex.delete(); }
    });
    this.framebuffers.scene.colorTex = createColorTex();
    this.framebuffers.scene.depthTex = createDepthTex();
    this.framebuffers.bloom.colorTex = createColorTex();
  }

  #drawFullscreenQuad(program, uniforms) {
    const gl = this.ctx;
    program.use();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.vertbuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quad.indibuff);
    program.enableAttributes();
    Object.entries(uniforms).forEach(([n, v]) => program[n].update(v));
    gl.drawElements(gl.TRIANGLES, this.quad.numindi, gl.UNSIGNED_SHORT, 0);
    program.disableAttributes();
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    program.unbind();
  }

  #checkFB() {
    const gl = this.ctx;
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("Unable to use FB");
    }
  }

  prepareOffScreenFB() {
    const gl = this.ctx;
    // ===================================================================
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.scene.id);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.framebuffers.scene.colorTex.id, 0
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D,
      this.framebuffers.scene.depthTex.id, 0
    );
    this.#checkFB();
    // ===================================================================
  }

  bloom(force) {
    const gl = this.ctx;
    // ===================================================================
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.bloom.id);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.framebuffers.bloom.colorTex.id, 0
    );
    this.#checkFB();
    // ===================================================================
    this.framebuffers.scene.colorTex.bind(0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.#drawFullscreenQuad(this.programs.bloom, {"uForce":force});
    this.framebuffers.scene.colorTex.unbind();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // ===================================================================
    // this.prepareOffScreenFB();
    // TODO: draw bloom buffer to scene buffer (?)
    // ===================================================================
  }
  
  renderFinalScene(exposure) {
    const gl = this.ctx;
    // ===================================================================
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffers.bloom.colorTex.bind(0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.#drawFullscreenQuad(this.programs.fbBlit, {"uExposure":exposure});
    this.framebuffers.bloom.colorTex.unbind();
    // ===================================================================
  }
}
