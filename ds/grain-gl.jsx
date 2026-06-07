/* Tollerud DS — GrainGradientGL: a WebGL replica of
   MathiasOki/tollerud-landing app/components/ui/gradient-background.tsx:
   @paper-design/shaders-react GrainGradient with shape: "corners", black
   backplate, softness 0.76, intensity 0.45, noise 0, speed 1, and the
   Tollerud yellow ramp. Falls back to static CSS if WebGL is unavailable.
   → window.GrainGradientGL */

function hslToRgb(str) {
  const m = /hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/.exec(str);
  if (!m) return [1, 1, 1];
  let h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
}

const GG_VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const GG_FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c1, u_c2, u_c3, u_back;
uniform float u_intensity, u_softness, u_grain;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p*=2.02; a*=0.5; } return v; }

float corner(vec2 q, vec2 c, float soft){ return smoothstep(soft, 0.0, distance(q, c)); }

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t = u_time * 0.08;

  // organic drift: warp the field with low-freq fbm
  vec2 q = uv;
  q += 0.12 * vec2(fbm(uv*1.6 + vec2(t, 0.0)) - 0.5, fbm(uv*1.6 + vec2(0.0, t) + 7.3) - 0.5);

  float soft = mix(0.34, 0.92, u_softness);
  float gain = 0.55 + u_intensity * 0.95;

  // corner light pools (top-right dominant, bottom-left secondary — matches the site)
  float tr = corner(q, vec2(1.0, 1.0) + 0.06*vec2(sin(t*1.1), cos(t*0.9)), soft);
  float bl = corner(q, vec2(0.0, 0.0) + 0.06*vec2(cos(t*0.8), sin(t*1.2)), soft*0.85);
  float tl = corner(q, vec2(0.0, 1.0) + 0.05*vec2(sin(t*0.7), cos(t*1.3)), soft*0.58);

  // additive yellow blooms over black; overlaps bloom toward white (the hot core)
  vec3 col = u_back;
  col += u_c2 * tr * (0.95 * gain);
  col += u_c3 * bl * (0.80 * gain);
  col += u_c1 * tl * (0.55 * gain);

  // bright hot-core drifting through the top-right pool (warm white bloom)
  vec2 hotc = vec2(0.86 + 0.05*sin(t*0.9), 0.62 + 0.05*cos(t*1.1));
  float hot = smoothstep(0.34, 0.0, distance(q, hotc));
  col += vec3(1.0, 0.97, 0.82) * hot * 0.5 * gain;

  // animated film grain
  float g = hash(gl_FragCoord.xy * 1.7 + fract(u_time) * 311.0);
  col += (g - 0.5) * u_grain;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

function GrainGradientGL({
  colors = ['hsl(54, 85%, 66%)', 'hsl(56, 100%, 80%)', 'hsl(56, 100%, 50%)'],
  colorBack = 'hsl(0, 0%, 0%)',
  softness = 0.76, intensity = 0.45, grain = 0, speed = 1,
  className = '', style,
}) {
  const ref = useRef(null);
  const failed = useRef(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { failed.current = true; setFallback(true); return; }

    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, GG_VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, GG_FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { failed.current = true; setFallback(true); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const u_res = U('u_res'), u_time = U('u_time');
    gl.uniform3fv(U('u_c1'), hslToRgb(colors[0]));
    gl.uniform3fv(U('u_c2'), hslToRgb(colors[1]));
    gl.uniform3fv(U('u_c3'), hslToRgb(colors[2]));
    gl.uniform3fv(U('u_back'), hslToRgb(colorBack));
    gl.uniform1f(U('u_intensity'), intensity);
    gl.uniform1f(U('u_softness'), softness);
    gl.uniform1f(U('u_grain'), grain);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u_res, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf, start = performance.now();
    const draw = (now) => {
      const t = reduce ? 6.0 : ((now - start) / 1000) * speed;
      gl.uniform1f(u_time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(start);

    return () => { window.removeEventListener('resize', resize); if (raf) cancelAnimationFrame(raf); const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); };
  }, [colors.join(), colorBack, softness, intensity, grain, speed]);

  if (fallback) {
    const [c1, c2, c3] = colors;
    return (
      <div className={`tollerud-grain-gradient is-animated ${className}`} style={style} aria-hidden="true">
        <div className="tollerud-grain-gradient__field" style={{
          background:
            `radial-gradient(70% 75% at 100% 0%, ${c2} 0%, transparent 70%),` +
            `radial-gradient(80% 85% at 0% 100%, ${c3} 0%, transparent 72%),` +
            `radial-gradient(60% 65% at 0% 0%, ${c1} 0%, transparent 68%)`,
          opacity: Math.min(1, intensity + 0.3),
        }}/>
        {grain > 0 && <div className="tollerud-grain-gradient__grain"/>}
      </div>
    );
  }
  return <canvas ref={ref} className={className} aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...style }}/>;
}
window.GrainGradientGL = GrainGradientGL;
