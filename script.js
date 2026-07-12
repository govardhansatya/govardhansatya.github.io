/* ============================================================
   GOVARDHAN SATYA GADI — Portfolio JS
   ============================================================ */

(() => {
  'use strict';

  /* ---- Reveal on Scroll (Intersection Observer) ----------- */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop watching
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));


  /* ---- Nav: add .scrolled class on scroll --------------- */
  const nav = document.getElementById('nav');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once on page load in case page is reloaded mid-scroll
  handleScroll();


  /* ---- Mobile Hamburger ---------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);

    // Animate hamburger bars into X
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    });
  });


  /* ---- Custom Cursor ------------------------------------- */
  const dot = document.getElementById('cursorDot');

  // Only activate on non-touch devices
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice()) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth trailing effect
    const animateCursor = () => {
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      dot.style.left = dotX + 'px';
      dot.style.top  = dotY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Grow cursor on interactive elements
    const interactiveEls = document.querySelectorAll(
      'a, button, .project-card, .skill-group, .timeline-card, .contact-card'
    );

    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.style.width  = '24px';
        dot.style.height = '24px';
        dot.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.width  = '';
        dot.style.height = '';
        dot.style.opacity = '';
      });
    });
    // Add CSS class to strictly hide real cursor if JS is working & non-touch
    document.body.classList.add('cursor-none');

  } else {
    // On touch, hide cursor dot and restore default cursor
    dot.style.display = 'none';
    document.body.classList.remove('cursor-none');
  }


  /* ---- Smooth active nav link highlighting -------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--text)';
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => sectionObserver.observe(s));


  /* ---- Stagger project cards on enter -------------------- */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  const skillGroups = document.querySelectorAll('.skill-group');
  skillGroups.forEach((g, i) => {
    g.style.transitionDelay = `${i * 0.06}s`;
  });

  const eduItems = document.querySelectorAll('.edu-item');
  eduItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });


  /* ---- Animate hero on load ------------------------------ */
  window.addEventListener('load', () => {
    // Trigger hero reveals sequentially
    const heroReveals = document.querySelectorAll('.hero-content .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 + i * 120);
    });

    // Scroll hint fades in later
    const hint = document.querySelector('.hero-scroll-hint');
    if (hint) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        hint.style.opacity = '0.7';
      }, 1400);
    }
  });


  /* ---- Prevent scroll-linked jank ----------------------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  /* ---- Dark Mode Toggle ----------------------------------- */
  const themeToggleMsg = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on localStorage, fallback to system preference
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleMsg) {
    themeToggleMsg.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* ---- Back to Top ---------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---- Update Copyright Year ------------------------------ */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

})();


/* ================================================================
   BACKGROUND — site-wide animated WebGL gradient
   Three soft, slowly-drifting colour blobs blended over the base
   background colour, in the site's pink/rose palette. Reacts gently
   to the cursor and re-reads the palette whenever the theme toggles.
   ================================================================ */
(() => {
  const canvas = document.getElementById('bgCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  const VERT_SRC = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const FRAG_SRC = `
    precision mediump float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor0;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= uResolution.x / uResolution.y;

      float t = uTime * 0.045;

      vec2 c1 = vec2(sin(t * 1.3) * 0.7, cos(t * 1.7) * 0.5) + uMouse * 0.12;
      vec2 c2 = vec2(cos(t * 0.9) * 0.8, sin(t * 1.1) * 0.6);
      vec2 c3 = vec2(sin(t * 0.6 + 2.0) * 0.6, cos(t * 0.8 + 1.0) * 0.75);

      float d1 = length(p - c1);
      float d2 = length(p - c2);
      float d3 = length(p - c3);

      float g1 = smoothstep(1.15, 0.0, d1);
      float g2 = smoothstep(1.05, 0.0, d2);
      float g3 = smoothstep(0.95, 0.0, d3);

      vec3 color = uColor0;
      color = mix(color, uColor1, g1 * 0.75);
      color = mix(color, uColor2, g2 * 0.55);
      color = mix(color, uColor3, g3 * 0.4);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertShader = compileShader(gl.VERTEX_SHADER, VERT_SRC);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vertShader || !fragShader) {
    canvas.style.display = 'none';
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(program);

  // Fullscreen triangle (covers the viewport without a quad/index buffer)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uMouse = gl.getUniformLocation(program, 'uMouse');
  const uColor0 = gl.getUniformLocation(program, 'uColor0');
  const uColor1 = gl.getUniformLocation(program, 'uColor1');
  const uColor2 = gl.getUniformLocation(program, 'uColor2');
  const uColor3 = gl.getUniformLocation(program, 'uColor3');

  function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '');
    const bigint = parseInt(clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean, 16);
    return [
      ((bigint >> 16) & 255) / 255,
      ((bigint >> 8) & 255) / 255,
      (bigint & 255) / 255,
    ];
  }

  function readPalette() {
    const styles = getComputedStyle(document.documentElement);
    gl.uniform3fv(uColor0, hexToRgb(styles.getPropertyValue('--bg') || '#fef8f5'));
    gl.uniform3fv(uColor1, hexToRgb(styles.getPropertyValue('--pink-pale') || '#fce8e2'));
    gl.uniform3fv(uColor2, hexToRgb(styles.getPropertyValue('--pink-light') || '#f4c5ba'));
    gl.uniform3fv(uColor3, hexToRgb(styles.getPropertyValue('--pink-mid') || '#de8a7c'));
  }
  readPalette();

  // Re-read the palette whenever the theme toggles
  new MutationObserver(readPalette).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Render at a slightly reduced resolution — a soft gradient doesn't
  // need full pixel density, and it's cheaper to animate every frame.
  const RENDER_SCALE = 0.6;
  let W = 0, H = 0;

  function resize() {
    W = Math.floor(window.innerWidth * RENDER_SCALE);
    H = Math.floor(window.innerHeight * RENDER_SCALE);
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uResolution, W, H);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  let running = true;
  const start = performance.now();

  function render() {
    const elapsed = (performance.now() - start) / 1000;
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick() {
    if (!running) return;
    render();
    requestAnimationFrame(tick);
  }

  if (prefersReducedMotion.matches) {
    // Draw a single static frame instead of animating
    render();
  } else {
    tick();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        tick();
      }
    });
  }
})();


/* ================================================================
   3D TILT + SCROLL PARALLAX
   Cursor-tracked tilt on cards/photo, and depth-of-field parallax
   on hero blobs + section tags as the page scrolls.
   ================================================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (prefersReducedMotion.matches || isTouchDevice) return;

  /* ---- Cursor-tracked 3D tilt ----------------------------- */
  const tiltEls = document.querySelectorAll('.tilt-target');

  tiltEls.forEach((el) => {
    const maxTilt = el.id === 'tiltPhoto' ? 10 : 6;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotY = (px - 0.5) * maxTilt * 2;
      const rotX = (0.5 - py) * maxTilt * 2;

      el.classList.remove('tilt-resting');
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.classList.add('tilt-resting');
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ---- Scroll parallax ------------------------------------ */
  const parallaxEls = document.querySelectorAll('.parallax');
  const sectionTags = document.querySelectorAll('.section-tag');

  let parallaxTicking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.2');
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });

    sectionTags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      // Small drift as the tag enters/leaves the viewport
      const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
      tag.style.transform = `translateY(${(1 - progress) * 10}px)`;
    });

    parallaxTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }, { passive: true });

  updateParallax();
})();

