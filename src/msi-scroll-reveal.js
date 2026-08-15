export function initMsiScrollReveal() {
  const section = document.getElementById('msi-scrollytelling');
  const canvas = document.getElementById('msi-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const totalFrames = 240;
  const frames = [];
  let loadedCount = 0;
  let currentFrameIndex = 0;
  let isLoaded = false;
  let isVisible = false;
  let animationFrameId = null;

  const preloaderEl = document.getElementById('msi-preloader');
  const progressText = document.getElementById('msi-loader-progress');
  const progressBar = document.getElementById('msi-loader-bar');
  const overlays = document.querySelectorAll('.msi-story-overlay');

  // Set canvas dimensions with device pixel density ratio
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    if (isLoaded && frames[currentFrameIndex]) {
      renderFrame(currentFrameIndex);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Preload all 240 frames
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `/msi-frames/ezgif-frame-${frameNum}.jpg`;

    img.onload = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / totalFrames) * 100);
      if (progressText) progressText.textContent = `${progress}%`;
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (loadedCount === totalFrames) {
        isLoaded = true;
        onPreloadComplete();
      }
    };

    img.onerror = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        isLoaded = true;
        onPreloadComplete();
      }
    };

    frames.push(img);
  }

  function onPreloadComplete() {
    if (preloaderEl) {
      preloaderEl.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        preloaderEl.style.display = 'none';
      }, 500);
    }
    renderFrame(0);
    updateScroll();
  }

  function renderFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Fill background with deep studio black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);

    // Cover Scaling: Fill 100% of viewport edge-to-edge eliminating blank void bars
    const imgRatio = img.width / img.height;
    const canvasRatio = cw / ch;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - drawHeight) / 2;
    } else {
      drawHeight = ch;
      drawWidth = ch * imgRatio;
      offsetX = (cw - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function updateScroll() {
    if (!isLoaded || !isVisible) return;

    const rect = section.getBoundingClientRect();
    const totalScrollable = section.clientHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    // Progress from 0 to 1
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

    // Calculate frame target
    const targetIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));

    if (targetIndex !== currentFrameIndex) {
      currentFrameIndex = targetIndex;
      renderFrame(currentFrameIndex);
    }

    // Update Story Overlay Visibility based on scroll percentage
    overlays.forEach((overlay) => {
      const minProgress = parseFloat(overlay.getAttribute('data-min') || '0');
      const maxProgress = parseFloat(overlay.getAttribute('data-max') || '1');

      if (progress >= minProgress && progress <= maxProgress) {
        overlay.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'translate-y-0');
      } else {
        overlay.classList.remove('opacity-100', 'translate-y-0');
        overlay.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
      }
    });
  }

  // Smooth RAF Scroll listener
  function onScroll() {
    if (animationFrameId) return;
    animationFrameId = requestAnimationFrame(() => {
      updateScroll();
      animationFrameId = null;
    });
  }

  // IntersectionObserver to pause scroll calculations when section is out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        updateScroll();
      } else {
        isVisible = false;
        window.removeEventListener('scroll', onScroll);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0.01 });

  observer.observe(section);
}
