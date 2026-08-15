import VanillaTilt from 'vanilla-tilt';
import { initHeroThreeJS } from './three-hero.js';
import { initTechThreeJS } from './three-tech.js';
import { initContactShader } from './shader-contact.js';
import { initMsiScrollReveal } from './msi-scroll-reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js, WebGL scenes, and Scrollytelling
  initHeroThreeJS();
  initTechThreeJS();
  initContactShader();
  initMsiScrollReveal();

  const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Magnetic Pull Interaction for Big Social Links (Desktop / Fine pointers only)
  if (isHoverDevice) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0) scale(1.02)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }, { passive: true });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      }, { passive: true });
    });
  }

  // GPU-Accelerated Custom Cursor (Desktop / Fine pointers only)
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (isHoverDevice && cursorDot && cursorOutline) {
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;
    let cursorRaf = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorRaf) {
        cursorRaf = requestAnimationFrame(updateCursorPosition);
      }
    }, { passive: true });

    function updateCursorPosition() {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      outlineX += (mouseX - outlineX) * 0.2;
      outlineY += (mouseY - outlineY) * 0.2;
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(mouseX - outlineX) > 0.1 || Math.abs(mouseY - outlineY) > 0.1) {
        cursorRaf = requestAnimationFrame(updateCursorPosition);
      } else {
        cursorRaf = null;
      }
    }

    const interactiveEls = document.querySelectorAll('.cursor-interactive, a, button, input, textarea, select');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
    });
  }

  // Navbar Scroll Glow via IntersectionObserver (Zero scroll thrashing!)
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  if (navbar && heroSection) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          navbar.classList.add('shadow-[0_0_30px_rgba(139,92,246,0.15)]', 'bg-background/95');
        } else {
          navbar.classList.remove('shadow-[0_0_30px_rgba(139,92,246,0.15)]', 'bg-background/95');
        }
      });
    }, { threshold: 0.8 });

    navObserver.observe(heroSection);
  }

  // Mobile Drawer Menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(show) {
    if (!mobileMenu) return;
    if (show) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  mobileToggle?.addEventListener('click', () => {
    const isHidden = mobileMenu?.classList.contains('opacity-0');
    toggleMobileMenu(isHidden);
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // 3D Tilt Card initialization (Desktop / Fine pointers only to preserve battery on mobile)
  const tiltElements = document.querySelectorAll('#portrait-card, .js-tilt');
  if (isHoverDevice && tiltElements.length > 0) {
    VanillaTilt.init(tiltElements, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02,
      gyroscope: false
    });
  }

  // Certificate Modal Logic with Real PDF Data
  const certModal = document.getElementById('cert-modal');
  const closeCertModalBtn = document.getElementById('close-cert-modal');
  const certCards = document.querySelectorAll('.cert-card');

  const certData = {
    google: {
      title: 'Google AI Professional Certificate',
      issuer: 'Google Career Certificates — Coursera',
      badge: 'AI & PROMPT ENGINEERING',
      img: '/certificates/google-ai-cert.png',
      pdf: '/certificates/google-ai-certificate.pdf',
      desc: 'Fluent in AI across 7 completed courses demonstrating practical application in AI Fundamentals, Brainstorming & Planning, Research & Insights, Content Creation, Data Analysis, and App Building.',
      id: 'ID: CAMYGCFM5XV5',
      verifyUrl: 'https://coursera.org/verify/professional-cert/CAMYGCFM5XV5'
    },
    ibm: {
      title: 'Generative AI for Digital Marketing',
      issuer: 'IBM & SkillUp — Coursera',
      badge: 'GEN AI & GEO OPTIMIZATION',
      img: '/certificates/ibm-genai-cert.png',
      pdf: '/certificates/ibm-genai-certificate.pdf',
      desc: 'Specialization covering GenAI Core Concepts, Prompt Engineering Basics, Accelerating Digital Marketing Workflows, and AI SEO / Generative Engine Optimization (GEO).',
      id: 'ID: 6TT4FZHTSP1Q',
      verifyUrl: 'https://coursera.org/verify/specialization/6TT4FZHTSP1Q'
    }
  };

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-cert');
      const data = certData[key];
      if (!data || !certModal) return;

      const modalImg = document.getElementById('modal-cert-img');
      if (modalImg) modalImg.src = data.img;

      document.getElementById('modal-cert-title').textContent = data.title;
      document.getElementById('modal-cert-issuer').textContent = data.issuer;
      document.getElementById('modal-cert-desc').textContent = data.desc;
      document.getElementById('modal-cert-id').textContent = data.id;
      document.getElementById('modal-cert-badge').textContent = data.badge;

      const verifyBtn = document.getElementById('btn-verify-badge');
      if (verifyBtn) verifyBtn.href = data.verifyUrl;

      const pdfBtn = document.getElementById('btn-view-pdf');
      if (pdfBtn) pdfBtn.href = data.pdf;

      certModal.classList.remove('opacity-0', 'pointer-events-none');
    });
  });

  closeCertModalBtn?.addEventListener('click', () => {
    certModal?.classList.add('opacity-0', 'pointer-events-none');
  });

  certModal?.addEventListener('click', (e) => {
    if (e.target === certModal) {
      certModal.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  // Dossier Button
  document.getElementById('btn-view-dossier')?.addEventListener('click', () => {
    const skillsSection = document.getElementById('skills');
    skillsSection?.scrollIntoView({ behavior: 'smooth' });
  });
});
