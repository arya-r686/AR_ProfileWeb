export function initContactShader() {
  const canvas = document.getElementById('contact-shader-canvas');
  if (!canvas) return;

  const contactSection = document.getElementById('contact');
  let animationFrameId = null;
  let isVisible = false;

  function syncSize() {
    const container = canvas.parentElement;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(syncSize, 100);
  }, { passive: true });

  syncSize();

  const gl = canvas.getContext('webgl', { powerPreference: 'high-performance' }) ||
             canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vs = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fs = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_texCoord;
      vec2 mouse = u_mouse / u_resolution;

      float dist = distance(uv, vec2(0.5) + 0.2 * vec2(sin(u_time * 0.4), cos(u_time * 0.3)));
      float mouseDist = distance(uv, mouse);

      vec3 color = vec3(0.06, 0.08, 0.09);
      vec3 accent = vec3(0.54, 0.36, 0.96); // Electric Violet

      float glow = 0.09 / (dist + 0.45);
      float mouseGlow = 0.06 / (mouseDist + 0.35);

      color += accent * (glow + mouseGlow);

      // Fine grain texture
      float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      color += (grain - 0.5) * 0.025;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vs));
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

  window.addEventListener('mousemove', (e) => {
    if (!isVisible) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas.width;
      mouse.y = ny * canvas.height;
    }
  }, { passive: true });

  function render(time) {
    if (!isVisible) return;
    animationFrameId = requestAnimationFrame(render);

    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, time * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // IntersectionObserver to pause loop when offscreen
  if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            render(performance.now());
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    observer.observe(contactSection);
  } else {
    isVisible = true;
    render(performance.now());
  }
}
