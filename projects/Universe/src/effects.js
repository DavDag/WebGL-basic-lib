/** @author: Davide Risaliti davdag24@gmail.com */

import { Mat4, Program, Quad, Shader, Texture, TexturedShape, Vec3 } from "webgl-basic-lib";

export class Effects {
  ctx;
  quad;
  invertFB=null;
  framebuffers={
    scene:{id:null,colorTex:null,depthTex:null},
    tmp1:{id:null,colorTex:null,},
    tmp2:{id:null,colorTex:null,},
    iter:0,
    swap: function() { ++this.iter; },
    curr: function() { return (this.iter % 2 == 0) ? this.tmp1 : this.tmp2; },
    next: function() { return (this.iter % 2 == 1) ? this.tmp1 : this.tmp2; },
  };
  programs={
    blit:null,
    bloom:{first:null,blur:null},
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
  uniform sampler2D uTextureScene;
  uniform sampler2D uTextureBloom;
  uniform float uBloom;
  uniform float uToneMapping;
  uniform float uExposure;
  varying vec2 vTex;
  void main() {
    vec4 col = texture2D(uTextureScene, vTex);
    vec4 bloom = texture2D(uTextureBloom, vTex);

    vec3 res = col.rgb;

    if (uToneMapping > 0.0) {
      // exposure tone mapping
      vec3 hdr = col.rgb + bloom.rgb;
      res = vec3(1.0) - exp(-hdr * uExposure);
  
      // gamma correction 
      const float gamma = 2.2;
      res = pow(res, vec3(1.0 / gamma));  
    }
    else {
      res = (uBloom > 0.0) ? bloom.rgb : col.rgb;
    }
  
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

  static F_SHADER_BLOOM_FIRST_RENDER = 
  `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vTex;
  void main() {
    vec4 col = texture2D(uTexture, vTex);
    float bright = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    if (bright > 1.0) {
      gl_FragColor = vec4(col.rgb, 1.0);
    }
    else {
      gl_FragColor = vec4(vec3(0.0), 1.0);
    }
  }
  `;

  static F_SHADER_BLOOM_BLUR = 
  `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uTexSizeW;
  uniform float uTexSizeH;
  uniform float uIsHorizontal;
  varying vec2 vTex;
  void main() {
    float weight[5];
    weight[0] = 0.227027;
    weight[1] = 0.1945946;
    weight[2] = 0.1216216;
    weight[3] = 0.054054;
    weight[4] = 0.016216;

    vec4 col = texture2D(uTexture, vTex);

    const int N = 5;
    vec2 tex_offset = vec2(1.0 / uTexSizeW, 1.0 / uTexSizeH);
    vec3 res = col.rgb * weight[0];
    if (uIsHorizontal > 0.0) {
      for(int i = 1; i < N; ++i)
      {
          res += texture2D(uTexture, vTex + vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
          res += texture2D(uTexture, vTex - vec2(tex_offset.x * float(i), 0.0)).rgb * weight[i];
      }
    }
    else {
      for(int i = 1; i < N; ++i)
      {
          res += texture2D(uTexture, vTex + vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
          res += texture2D(uTexture, vTex - vec2(0.0, tex_offset.y * float(i))).rgb * weight[i];
      }
    }

    gl_FragColor = vec4(res, 1.0);
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
        ["uTextureScene", "1i"],
        ["uTextureBloom", "1i"],
        ["uBloom", "1f"],
        ["uExposure", "1f"],
        ["uToneMapping", "1f"],
      ]);
      program.use();
      program.uTextureScene.update(0);
      program.uTextureBloom.update(1);
      program.uMatrix.update(this.invertFB.values);
      program.unbind();
      this.programs.blit = program;
    }
    // ========= BLOOM PROGRAM: First iteration ============
    {
      const program = new Program(gl);
      program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Effects.V_SHADER_BLOOM));
      program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Effects.F_SHADER_BLOOM_FIRST_RENDER));
      program.attributes([
        ["aPos", 3, gl.FLOAT, 4 * TexturedShape.VertexSize(),  0],
        ["aTex", 2, gl.FLOAT, 4 * TexturedShape.VertexSize(), 12],
      ]);
      program.link();
      program.declareUniforms([
        ["uMatrix", "Matrix4fv"],
        ["uTexture", "1i"],
      ]);
      program.use();
      program.uTexture.update(0);
      program.uMatrix.update(this.invertFB.values);
      program.unbind();
      this.programs.bloom.first = program;
    }
    // ========= BLOOM PROGRAM: Blur ============
    {
      const program = new Program(gl);
      program.attachShader(new Shader(gl, gl.VERTEX_SHADER, Effects.V_SHADER_BLOOM));
      program.attachShader(new Shader(gl, gl.FRAGMENT_SHADER, Effects.F_SHADER_BLOOM_BLUR));
      program.attributes([
        ["aPos", 3, gl.FLOAT, 4 * TexturedShape.VertexSize(),  0],
        ["aTex", 2, gl.FLOAT, 4 * TexturedShape.VertexSize(), 12],
      ]);
      program.link();
      program.declareUniforms([
        ["uMatrix", "Matrix4fv"],
        ["uTexture", "1i"],
        ["uIsHorizontal", "1f"],
        ["uTexSizeW", "1f"],
        ["uTexSizeH", "1f"],
      ]);
      program.use();
      program.uTexture.update(0);
      program.uMatrix.update(this.invertFB.values);
      program.unbind();
      this.programs.bloom.blur = program;
    }
    // ==============================================
    this.framebuffers.scene.id = gl.createFramebuffer();
    this.framebuffers.tmp1.id = gl.createFramebuffer();
    this.framebuffers.tmp2.id = gl.createFramebuffer();
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
      if (fbo.colorTex) { fbo.colorTex.delete(); fbo.colorTex = null; }
      if (fbo.depthTex) { fbo.depthTex.delete(); fbo.depthTex = null; }
    });
    this.framebuffers.scene.colorTex = createColorTex();
    this.framebuffers.scene.depthTex = createDepthTex();
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
    this.framebuffers.tmp1.colorTex = createColorTex();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.tmp1.id);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.framebuffers.tmp1.colorTex.id, 0
    );
    this.#checkFB();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.tmp2.id);
    this.framebuffers.tmp2.colorTex = createColorTex();
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
      this.framebuffers.tmp2.colorTex.id, 0
    );
    this.#checkFB();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.programs.bloom.blur.use();
    this.programs.bloom.blur.uTexSizeW.update(w);
    this.programs.bloom.blur.uTexSizeH.update(h);
    this.programs.bloom.blur.unbind();
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
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.scene.id);
  }

  preparePostProcessingFB() {
    this.framebuffers.iter = 0;
  }

  bloom(force) {
    const gl = this.ctx;
    // ===================================================================
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.next().id);
    this.framebuffers.scene.colorTex.bind(0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.#drawFullscreenQuad(this.programs.bloom.first, {});
    this.framebuffers.scene.colorTex.unbind();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffers.swap();
    // ===================================================================
    for (let i = 0; i < force; ++i) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers.next().id);
      this.framebuffers.curr().colorTex.bind(0);
      this.#drawFullscreenQuad(this.programs.bloom.blur, {"uIsHorizontal":(i%2)});
      this.framebuffers.curr().colorTex.unbind();
      this.framebuffers.swap();
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // ===================================================================
  }
  
  renderFinalScene(hasBloom, hasToneMapping, exposure) {
    const gl = this.ctx;
    // ===================================================================
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffers.scene.colorTex.bind(0);
    this.framebuffers.curr().colorTex.bind(1);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.#drawFullscreenQuad(this.programs.blit, {
      "uBloom":+hasBloom,
      "uToneMapping":+hasToneMapping,
      "uExposure":exposure
    });
    this.framebuffers.scene.colorTex.unbind();
    this.framebuffers.curr().colorTex.unbind();
    // ===================================================================
    this.framebuffers.swap();
  }
}
