import * as THREE from 'three';

export function initTechThreeJS() {
  const canvas = document.getElementById('tech-canvas');
  if (!canvas) return;

  const techSection = document.getElementById('tech-stack');
  let isInitialized = false;
  let animationFrameId = null;
  let isVisible = false;

  // Lazy Initialization on IntersectionObserver
  if (techSection) {
    const initObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isInitialized) {
          isInitialized = true;
          startTechScene(canvas);
          initObserver.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    initObserver.observe(techSection);
  } else {
    startTechScene(canvas);
  }

  function createLabelSprite(text, colorHex) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 320;
    labelCanvas.height = 84;
    const ctx = labelCanvas.getContext('2d');

    ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);

    // Pill container background
    ctx.fillStyle = 'rgba(12, 16, 18, 0.88)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;

    const x = 8, y = 8, w = 304, h = 68, r = 14;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text Shadow / Glow
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 8;

    // Text Label
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, labelCanvas.width / 2, labelCanvas.height / 2);

    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.0, 0.78, 1);
    return sprite;
  }

  function startTechScene(canvas) {
    const container = canvas.parentElement;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 6, 23);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x8B5CF6, 9, 50);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const solarSystem = new THREE.Group();
    scene.add(solarSystem);

    // Core System Mesh
    const coreGeo = new THREE.SphereGeometry(1.8, 28, 28);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x8B5CF6,
      emissive: 0x6d3bd7,
      emissiveIntensity: 0.75,
      shininess: 120,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    solarSystem.add(coreMesh);

    // Core Label
    const coreLabel = createLabelSprite('TECH STACK', '#8B5CF6');
    coreLabel.position.set(0, 2.6, 0);
    coreLabel.scale.set(4.2, 1.0, 1);
    solarSystem.add(coreLabel);

    // 11 Technologies with requested names, distinct colors, and radii
    const technologies = [
      { name: 'HTML', color: 0xE34F26, hex: '#E34F26', distance: 4.0, size: 0.45, speed: 0.014 },
      { name: 'CSS', color: 0x1572B6, hex: '#1572B6', distance: 5.2, size: 0.45, speed: 0.012 },
      { name: 'JavaScript', color: 0xF7DF1E, hex: '#F7DF1E', distance: 6.4, size: 0.50, speed: 0.010 },
      { name: 'JAVA', color: 0xED8B00, hex: '#ED8B00', distance: 7.6, size: 0.50, speed: 0.0085 },
      { name: 'C', color: 0xA8B9CC, hex: '#A8B9CC', distance: 8.8, size: 0.42, speed: 0.0075 },
      { name: 'C++', color: 0x00599C, hex: '#00599C', distance: 10.0, size: 0.45, speed: 0.0068 },
      { name: 'PYTHON', color: 0x3776AB, hex: '#3776AB', distance: 11.2, size: 0.52, speed: 0.0060 },
      { name: 'REACT.js', color: 0x61DAFB, hex: '#61DAFB', distance: 12.5, size: 0.55, speed: 0.0053 },
      { name: 'MongoDB', color: 0x47A248, hex: '#47A248', distance: 13.8, size: 0.52, speed: 0.0047 },
      { name: 'SupaBase', color: 0x3ECF8E, hex: '#3ECF8E', distance: 15.1, size: 0.52, speed: 0.0042 },
      { name: 'Express.js', color: 0xE0E3E5, hex: '#E0E3E5', distance: 16.4, size: 0.48, speed: 0.0037 }
    ];

    const planets = [];
    const sharedSphereGeo = new THREE.SphereGeometry(1, 22, 22);

    technologies.forEach((tech, index) => {
      // Orbit Line Ring
      const ringGeo = new THREE.RingGeometry(tech.distance - 0.04, tech.distance + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: tech.color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      solarSystem.add(ringMesh);

      // Planet Mesh
      const planetMat = new THREE.MeshPhongMaterial({
        color: tech.color,
        emissive: tech.color,
        emissiveIntensity: 0.5,
        shininess: 100
      });
      const planetMesh = new THREE.Mesh(sharedSphereGeo, planetMat);
      planetMesh.scale.setScalar(tech.size);

      const angle = (index / technologies.length) * Math.PI * 2;
      planetMesh.position.x = Math.cos(angle) * tech.distance;
      planetMesh.position.z = Math.sin(angle) * tech.distance;

      solarSystem.add(planetMesh);

      // 3D Label Sprite floating above planet
      const labelSprite = createLabelSprite(tech.name, tech.hex);
      labelSprite.position.set(
        planetMesh.position.x,
        planetMesh.position.y + tech.size + 0.85,
        planetMesh.position.z
      );
      solarSystem.add(labelSprite);

      // Starry Particle Trail System for this planet
      const TRAIL_COUNT = 45;
      const trailPositions = new Float32Array(TRAIL_COUNT * 3);
      const trailData = [];

      for (let p = 0; p < TRAIL_COUNT; p++) {
        trailPositions[p * 3] = planetMesh.position.x;
        trailPositions[p * 3 + 1] = planetMesh.position.y;
        trailPositions[p * 3 + 2] = planetMesh.position.z;
        trailData.push({
          active: false,
          x: planetMesh.position.x,
          y: planetMesh.position.y,
          z: planetMesh.position.z,
          vx: 0, vy: 0, vz: 0,
          life: 0
        });
      }

      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.PointsMaterial({
        color: tech.color,
        size: 0.16,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });

      const trailSystem = new THREE.Points(trailGeo, trailMat);
      solarSystem.add(trailSystem);

      planets.push({
        mesh: planetMesh,
        label: labelSprite,
        tech: tech,
        angle: angle,
        trailSystem: trailSystem,
        trailGeo: trailGeo,
        trailData: trailData,
        trailCount: TRAIL_COUNT,
        spawnIndex: 0
      });
    });

    function updateCameraView() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;

      if (width < 640) {
        camera.position.set(0, 8, 36);
      } else if (width < 1024) {
        camera.position.set(0, 7, 28);
      } else {
        camera.position.set(0, 6, 23);
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    updateCameraView();

    // Mouse & Touch Drag Interaction
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const startDrag = (clientX, clientY) => {
      isDragging = true;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const moveDrag = (clientX, clientY) => {
      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        const deltaY = clientY - previousMouseY;

        solarSystem.rotation.y += deltaX * 0.005;
        solarSystem.rotation.x += deltaY * 0.005;

        previousMouseX = clientX;
        previousMouseY = clientY;
      }
    };

    const stopDrag = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mouseup', stopDrag, { passive: true });
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY), { passive: true });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', stopDrag, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCameraView, 100);
    }, { passive: true });

    const clock = new THREE.Clock();

    function animate() {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const speedFactor = delta * 60;

      if (!isDragging) {
        solarSystem.rotation.y += 0.0025 * speedFactor;
      }

      coreMesh.rotation.y += 0.01 * speedFactor;
      coreMesh.rotation.x += 0.005 * speedFactor;

      planets.forEach((p) => {
        p.angle += p.tech.speed * speedFactor;
        p.mesh.position.x = Math.cos(p.angle) * p.tech.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.tech.distance;
        p.mesh.rotation.y += 0.015 * speedFactor;

        // Keep 3D label positioned directly above the planet
        p.label.position.set(
          p.mesh.position.x,
          p.mesh.position.y + p.tech.size + 0.85,
          p.mesh.position.z
        );

        // Emit starry particles along orbit path
        const spawnCount = 2;
        for (let s = 0; s < spawnCount; s++) {
          const idx = (p.spawnIndex + s) % p.trailCount;
          const particle = p.trailData[idx];
          particle.active = true;
          particle.x = p.mesh.position.x + (Math.random() - 0.5) * 0.1;
          particle.y = p.mesh.position.y + (Math.random() - 0.5) * 0.1;
          particle.z = p.mesh.position.z + (Math.random() - 0.5) * 0.1;
          particle.vx = (Math.random() - 0.5) * 0.015;
          particle.vy = (Math.random() - 0.5) * 0.015 + 0.005;
          particle.vz = (Math.random() - 0.5) * 0.015;
          particle.life = 1.0;
        }
        p.spawnIndex = (p.spawnIndex + spawnCount) % p.trailCount;

        // Update trail particles
        const posAttr = p.trailGeo.attributes.position;
        const positionsArr = posAttr.array;

        for (let i = 0; i < p.trailCount; i++) {
          const pt = p.trailData[i];
          if (pt.active) {
            pt.x += pt.vx * speedFactor;
            pt.y += pt.vy * speedFactor;
            pt.z += pt.vz * speedFactor;
            pt.life -= 0.025 * speedFactor;

            if (pt.life <= 0) {
              pt.active = false;
              pt.x = p.mesh.position.x;
              pt.y = p.mesh.position.y;
              pt.z = p.mesh.position.z;
            }
          } else {
            pt.x = p.mesh.position.x;
            pt.y = p.mesh.position.y;
            pt.z = p.mesh.position.z;
          }

          positionsArr[i * 3] = pt.x;
          positionsArr[i * 3 + 1] = pt.y;
          positionsArr[i * 3 + 2] = pt.z;
        }
        posAttr.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    // Viewport IntersectionObserver to pause loop when offscreen
    if (techSection) {
      const visibilityObserver = new IntersectionObserver((entries) => {
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

      visibilityObserver.observe(techSection);
    } else {
      isVisible = true;
      clock.start();
      animate();
    }
  }
}
