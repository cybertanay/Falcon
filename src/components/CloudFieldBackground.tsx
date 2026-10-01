import React, { useEffect, useRef } from 'react';

/**
 * CloudFieldBackground
 * 
 * High-performance Raw WebGL implementation of ThreeUI Strata Cloud Field,
 * customized to Falcon International Traders' luxury green-to-black palette:
 * obsidian black (#020b08) -> deep forest green (#051a11) -> emerald ridges -> luminescent mint starlight.
 */
export const CloudFieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      powerPreference: 'low-power'
    });
    if (!gl) return;

    let animId: number;
    let isVisible = true;

    // Handle tab visibility to stop rendering when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const VS = `
      attribute vec2 a_pos;
      void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // Retoned Strata Cloud Field Fragment Shader: Emerald Forest to Obsidian Black
    const FS = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(float n){ return fract(sin(n)*43758.5453123); }
      float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

      float noise(float x){
        float i = floor(x);
        float f = fract(x);
        f = f*f*(3.0-2.0*f);
        return mix(hash(i), hash(i+1.0), f);
      }

      float fbm(float x, float octaves){
        float val = 0.0;
        float amp = 0.5;
        float freq = 1.0;
        for(int i = 0; i < 6; i++){
          if(float(i) >= octaves) break;
          val += amp * noise(x * freq);
          freq *= 2.17;
          amp *= 0.48;
        }
        return val;
      }

      // float meteor(vec2 uv, float t){
      //   float cycle = mod(t * 0.12, 1.0);
      //   float seed = floor(t * 0.12);
      //   float h = hash(seed * 7.31);
      //   float h2 = hash(seed * 13.17);
      //   if(h > 0.35) return 0.0;
      //   vec2 start = vec2(0.2 + h2 * 0.6, 0.75 + h * 0.2);
      //   vec2 dir = normalize(vec2(1.0, -0.55 - h * 0.25));
      //   float progress = smoothstep(0.0, 0.7, cycle);
      //   vec2 pos = start + dir * progress * 0.45;
      //   vec2 toP = uv - pos;
      //   float along = dot(toP, dir);
      //   float perp = length(toP - dir * along);
      //   float trail = smoothstep(0.0, -0.12, along) * smoothstep(-0.18, -0.04, along);
      //   float core = smoothstep(0.003, 0.0, perp) * trail;
      //   float glow = smoothstep(0.012, 0.0, perp) * trail * 0.3;
      //   float fade = smoothstep(0.0, 0.1, cycle) * smoothstep(0.8, 0.55, cycle);
      //   return (core + glow) * fade;
      // }

      float stars(vec2 uv, float density){
        vec2 cell = floor(uv * density);
        vec2 sub = fract(uv * density);
        float h = hash2(cell);
        float brightness = step(0.978, h);
        float size = 0.022 + h * 0.040;
        float d = length(sub - vec2(hash2(cell + 100.0), hash2(cell + 200.0)));
        float star = brightness * smoothstep(size, 0.0, d);
        star *= 0.5 + 0.5 * sin(u_time * (0.8 + h * 2.5) + h * 6.28);
        return star;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        float aspect = u_res.x / u_res.y;

        vec2 mouse = u_mouse * 2.0 - 1.0;

        // Falcon Forest Palette: Obsidian Black to Emerald/Forest Green
        vec3 skyTop    = vec3(0.008, 0.022, 0.016); // #020b08 Deep Obsidian
        vec3 skyMid    = vec3(0.018, 0.048, 0.032); // #051a11 Dark Forest
        vec3 skyBottom = vec3(0.035, 0.088, 0.058); // #092719 Rich Emerald

        float skyGrad = uv.y;
        vec3 col = mix(skyBottom, skyMid, smoothstep(0.25, 0.65, skyGrad));
        col = mix(col, skyTop, smoothstep(0.65, 1.0, skyGrad));

        // Luminous Emerald/Gold Horizon Glow
        float horizonY = 0.32;
        float horizonGlow = exp(-pow((uv.y - horizonY) * 3.6, 2.0));
        col += vec3(0.06, 0.20, 0.13) * horizonGlow * 0.75;

        // Center Ambient Core Glow
        float centerGlow = exp(-pow((uv.x - 0.5) * 1.5, 2.0)) * exp(-pow((uv.y - horizonY) * 3.8, 2.0));
        col += vec3(0.07, 0.22, 0.14) * centerGlow * 0.55;

        // Subtle Star Field
        float starField = stars(uv * vec2(aspect, 1.0), 60.0)
                        + stars(uv * vec2(aspect, 1.0) + 500.0, 100.0) * 0.7
                        + stars(uv * vec2(aspect, 1.0) + 900.0, 160.0) * 0.4;

        float starMask = 1.0;
        float xC, yS, prof, mTop, mtn, rDist, rGlow, rAmb;
        vec3 lC;

        // Layer 0: Furthest misty mountain ridge
        lC = vec3(0.045, 0.135, 0.092);
        xC = uv.x * aspect * 1.5 + u_time * 0.005 + mouse.x * 0.010;
        yS = mouse.y * 0.003;
        prof = fbm(xC, 5.0) * 0.10 + fbm(xC * 0.3 + 17.0, 3.0) * 0.07;
        mTop = 0.38 + prof + yS;
        mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
        rDist = abs(uv.y - mTop);
        rGlow = smoothstep(0.012, 0.0, rDist) * 0.18;
        rAmb = smoothstep(0.04, 0.0, rDist) * 0.06;
        col = mix(col, lC, mtn);
        col += vec3(0.08, 0.32, 0.20) * rGlow;
        col += vec3(0.05, 0.20, 0.12) * rAmb;
        starMask *= (1.0 - mtn);

        // Layer 1: Mid-distant mountain ridge
        lC = vec3(0.032, 0.102, 0.070);
        xC = uv.x * aspect * 1.9 + u_time * 0.010 + mouse.x * 0.018;
        yS = mouse.y * 0.006;
        prof = fbm(xC, 5.0) * 0.13 + fbm(xC * 0.3 + 34.0, 3.0) * 0.091;
        mTop = 0.31 + prof + yS;
        mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
        rDist = abs(uv.y - mTop);
        rGlow = smoothstep(0.012, 0.0, rDist) * 0.15;
        rAmb = smoothstep(0.04, 0.0, rDist) * 0.045;
        col = mix(col, lC, mtn);
        col += vec3(0.08, 0.30, 0.19) * rGlow;
        col += vec3(0.05, 0.18, 0.11) * rAmb;
        starMask *= (1.0 - mtn);

        // Layer 2: Mid-ground mountain ridge
        lC = vec3(0.022, 0.075, 0.050);
        xC = uv.x * aspect * 2.4 + u_time * 0.018 + mouse.x * 0.030;
        yS = mouse.y * 0.010;
        prof = fbm(xC, 5.0) * 0.16 + fbm(xC * 0.3 + 51.0, 3.0) * 0.112;
        mTop = 0.24 + prof + yS;
        mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
        rDist = abs(uv.y - mTop);
        rGlow = smoothstep(0.012, 0.0, rDist) * 0.12;
        rAmb = smoothstep(0.04, 0.0, rDist) * 0.03;
        col = mix(col, lC, mtn);
        col += vec3(0.07, 0.28, 0.17) * rGlow;
        col += vec3(0.04, 0.15, 0.09) * rAmb;
        starMask *= (1.0 - mtn);

        // Layer 3: Near-ground ridge
        lC = vec3(0.014, 0.050, 0.034);
        xC = uv.x * aspect * 3.0 + u_time * 0.028 + mouse.x * 0.045;
        yS = mouse.y * 0.015;
        prof = fbm(xC, 5.0) * 0.14 + fbm(xC * 0.3 + 68.0, 3.0) * 0.098;
        mTop = 0.16 + prof + yS;
        mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
        rDist = abs(uv.y - mTop);
        rGlow = smoothstep(0.012, 0.0, rDist) * 0.09;
        col = mix(col, lC, mtn);
        col += vec3(0.07, 0.24, 0.15) * rGlow;
        starMask *= (1.0 - mtn);

        // Layer 4: Deep obsidian foreground ridge
        lC = vec3(0.008, 0.026, 0.018);
        xC = uv.x * aspect * 3.8 + u_time * 0.040 + mouse.x * 0.065;
        yS = mouse.y * 0.021;
        prof = fbm(xC, 5.0) * 0.11 + fbm(xC * 0.3 + 85.0, 3.0) * 0.077;
        mTop = 0.08 + prof + yS;
        mtn = smoothstep(mTop + 0.003, mTop - 0.001, uv.y);
        rDist = abs(uv.y - mTop);
        rGlow = smoothstep(0.012, 0.0, rDist) * 0.06;
        col = mix(col, lC, mtn);
        col += vec3(0.06, 0.20, 0.13) * rGlow;
        starMask *= (1.0 - mtn);

        // Mint starlight & meteors
        col += vec3(0.85, 0.98, 0.90) * starField * starMask;
        // float met = meteor(uv * vec2(aspect, 1.0), u_time);
        // col += vec3(0.80, 0.98, 0.88) * met * starMask;

        // Vignette
        float vig = 1.0 - 0.25 * pow(length((uv - 0.5) * vec2(1.1, 1.5)), 2.0);
        col *= vig;

        // Morning atmospheric mist
        float haze = exp(-pow((uv.y - 0.30) * 4.8, 2.0)) * 0.05;
        col += vec3(0.06, 0.20, 0.13) * haze;

        col = pow(col, vec3(0.95));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(src: string, type: number) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Cloud shader compile error:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = createShader(VS, gl.VERTEX_SHADER);
    const fs = createShader(FS, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('Cloud program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mx = 0.5,
      my = 0.5;
    let smx = 0.5,
      smy = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = 0;
    const render = (timestamp: number) => {
      if (isVisible) {
        const t = timestamp * 0.001;
        // Limit render updates if delta is reasonable
        smx += (mx - smx) * 0.035;
        smy += (my - smy) * 0.035;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.uniform2f(uMouse, smx, smy);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-95 transition-opacity duration-1000"
      />
      {/* Gentle atmospheric vignette: keeps mountains and starry clouds vivid while guaranteeing text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030d0a]/15 to-[#030d0a]/60 pointer-events-none" />
    </div>
  );
};
