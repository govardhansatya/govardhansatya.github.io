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
   BACKGROUND CANVAS — drifting lines
   Fills the viewport; most visible in the side margins on wide
   screens where content doesn't reach.
   ================================================================ */
(() => {
  const canvas = document.getElementById('bgCanvas');
  // Disable animation if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || prefersReducedMotion.matches) {
    if (canvas) canvas.style.display = 'none';
    return;
  }
  
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Colour palette — warm pinks / roses
  const PALETTE = [
    'hsla(350, 60%, 72%,',   // rose pink
    'hsla(340, 50%, 68%,',   // mauve-pink
    'hsla(10,  55%, 70%,',   // peach-rose
    'hsla(330, 45%, 75%,',   // light mauve
    'hsla(355, 65%, 78%,',   // blush
  ];

  class DriftLine {
    constructor(spreadY) {
      this._spreadY = spreadY;
      this.reset(true);
    }

    reset(initial = false) {
      this.x       = Math.random() * W;
      this.y       = initial ? Math.random() * H : -(60 + Math.random() * 160);
      this.len     = 55 + Math.random() * 180;
      // Mostly pointing slightly right-and-down OR left-and-down
      const dir    = Math.random() < 0.5 ? 1 : -1;
      this.angle   = (Math.PI * 0.5) + dir * (0.3 + Math.random() * 0.55);
      this.speed   = 0.25 + Math.random() * 0.55;
      // Lines near edges are slightly more opaque for the "fill the sides" feel
      const edgePull = Math.max(
        1 - this.x / (W * 0.18),           // left edge
        1 - (W - this.x) / (W * 0.18),     // right edge
        0
      );
      this.alpha   = 0.025 + random() * 0.065 + edgePull * 0.04;
      this.color   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.width   = 0.4 + Math.random() * 0.9;
    }

    update() {
      this.y += this.speed;
      if (this.y > H + this.len + 20) this.reset(false);
    }

    draw() {
      const dx = Math.cos(this.angle) * this.len;
      const dy = Math.sin(this.angle) * this.len;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + dx, this.y + dy);
      ctx.strokeStyle = `${this.color}${this.alpha.toFixed(3)})`;
      ctx.lineWidth   = this.width;
      ctx.stroke();
    }
  }

  // Seeded-ish simple random so reset feels natural
  function random() { return Math.random(); }

  // On very wide screens add more lines so the sides feel alive
  function lineCount() {
    return W > 1400 ? 70 : W > 900 ? 50 : 30;
  }

  let lines = Array.from({ length: lineCount() }, () => new DriftLine(true));

  // Rebalance line count on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const target = lineCount();
      while (lines.length < target) lines.push(new DriftLine(true));
      if (lines.length > target) lines.length = target;
    }, 200);
  }, { passive: true });

  // --- Slow cross-lines: long horizontal wisps that drift vertically ---
  class WispLine {
    constructor() { this.reset(true); }
    reset(initial) {
      this.y     = initial ? Math.random() * H : -5;
      this.speed = 0.08 + Math.random() * 0.14;
      this.alpha = 0.018 + Math.random() * 0.022;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.width = 0.5 + Math.random() * 0.5;
      // Width covers only the outer margins, not the centre content
      this.xStart = 0;
      this.xEnd   = W;
    }
    update() {
      this.y += this.speed;
      if (this.y > H + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.xStart, this.y);
      ctx.lineTo(this.xEnd, this.y);
      ctx.strokeStyle = `${this.color}${this.alpha.toFixed(3)})`;
      ctx.lineWidth   = this.width;
      ctx.stroke();
    }
  }

  const wisps = Array.from({ length: 12 }, () => new WispLine());
  let running = true;

  function tick() {
    if (!running) return;
    
    ctx.clearRect(0, 0, W, H);

    ctx.lineCap = 'round';

    wisps.forEach(w => { w.update(); w.draw(); });
    lines.forEach(l => { l.update(); l.draw(); });

    requestAnimationFrame(tick);
  }

  tick();

  // Performance Optimization: Pause canvas when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else {
      // Small check to avoid kicking off multiple loops
      if (!running) {
        running = true;
        tick();
      }
    }
  });
})();

