import * as THREE from 'three';

export function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Vibrant Multi-Spectral Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8B5CF6, 12, 60);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xD8B4FE, 8, 60);
  pointLight2.position.set(-5, -5, 3);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x00F0FF, 6, 60);
  pointLight3.position.set(0, 6, -4);
  scene.add(pointLight3);

  // Outer TorusKnot 3D Mesh
  const geometry = new THREE.TorusKnotGeometry(1.65, 0.48, 220, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xA78BFA,
    emissive: 0x6D28D9,
    emissiveIntensity: 0.85,
    shininess: 180,
    specular: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.95
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // Inner Glowing Core Sphere
  const innerGeo = new THREE.SphereGeometry(0.85, 20, 20);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xD8B4FE,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  torusKnot.add(innerCore);

  // Bright Starry Particle background field
  const particleCount = 450;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 16;
    positions[i + 1] = (Math.random() - 0.5) * 16;
    positions[i + 2] = (Math.random() - 0.5) * 16;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xE9D5FF,
    size: 0.065,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particlesGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Interaction (throttled/lerped)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 100);
  }, { passive: true });

  // Clock for frame-rate independent delta-time movement
  const clock = new THREE.Clock();
  let animationFrameId = null;
  let isVisible = false;

  function animate() {
    if (!isVisible) return;
    animationFrameId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const speedFactor = delta * 60;

    targetX += (mouseX - targetX) * 0.05 * speedFactor;
    targetY += (mouseY - targetY) * 0.05 * speedFactor;

    torusKnot.rotation.x += (0.006 + targetY * 0.008) * speedFactor;
    torusKnot.rotation.y += (0.008 + targetX * 0.008) * speedFactor;

    innerCore.rotation.x -= 0.01 * speedFactor;
    innerCore.rotation.y -= 0.012 * speedFactor;

    particleSystem.rotation.y -= 0.0015 * speedFactor;

    renderer.render(scene, camera);
  }

  // IntersectionObserver to pause rendering loop when offscreen
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            clock.start();
            animate();
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

    observer.observe(heroSection);
  } else {
    isVisible = true;
    clock.start();
    animate();
  }
}
