// ─── Starfield ───────────────────────────────────────────────────────
(function initStars() {
  const field = document.getElementById('starField');
  if (!field) return;

  const count = 90;
  const layers = [
    { minSize: 1, maxSize: 1.5, opacityRange: [0.15, 0.4], durationRange: [5, 9], className: 'star-far' },
    { minSize: 1.5, maxSize: 2.5, opacityRange: [0.3, 0.6], durationRange: [4, 7], className: 'star-mid' },
    { minSize: 2.5, maxSize: 4, opacityRange: [0.5, 0.9], durationRange: [3, 5], className: 'star-near' },
  ];

  for (let i = 0; i < count; i++) {
    const layer = layers[i % 3];
    const s = document.createElement('span');
    const size = layer.minSize + Math.random() * (layer.maxSize - layer.minSize);
    const opacity = layer.opacityRange[0] + Math.random() * (layer.opacityRange[1] - layer.opacityRange[0]);
    s.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      opacity:${opacity.toFixed(2)};
      animation-delay:${(Math.random() * 5).toFixed(1)}s;
      animation-duration:${(layer.durationRange[0] + Math.random() * (layer.durationRange[1] - layer.durationRange[0])).toFixed(1)}s;
    `;
    s.className = 'star ' + layer.className;
    field.appendChild(s);
  }

  // Shooting stars
  function createShootingStar() {
    const star = document.createElement('span');
    star.className = 'shooting-star';
    const startX = 20 + Math.random() * 60;
    star.style.cssText = `
      position:absolute;
      top:${5 + Math.random() * 20}%;
      left:${startX}%;
      animation:shoot ${2 + Math.random() * 2}s ease-out forwards;
      animation-delay:0s;
    `;
    field.appendChild(star);
    setTimeout(() => star.remove(), 4000);
  }

  function scheduleShootingStar() {
    setTimeout(() => {
      createShootingStar();
      scheduleShootingStar();
    }, 3000 + Math.random() * 12000);
  }
  scheduleShootingStar();
})();

// ─── Floating Particles ─────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    const size = 2 + Math.random() * 3;
    const isGold = Math.random() > 0.7;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      background:${isGold ? 'var(--accent-gold)' : 'var(--accent-teal)'};
      opacity:${(0.08 + Math.random() * 0.15).toFixed(2)};
      animation:float-particle ${12 + Math.random() * 20}s ease-in-out infinite;
      animation-delay:${(Math.random() * 15).toFixed(1)}s;
      border-radius:50%;
      pointer-events:none;
    `;
    container.appendChild(p);
  }
})();

// ─── Scroll Progress Bar ────────────────────────────────────────────
(function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
    bar.setAttribute('aria-valuenow', Math.round(progress));
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ─── Mobile Nav Toggle ──────────────────────────────────────────────
(function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true' ? false : true;
    toggle.setAttribute('aria-expanded', expanded);
    links.classList.toggle('nav__links--open');
    document.body.classList.toggle('nav-open');
  });

  // Close nav on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('nav__links--open');
      document.body.classList.remove('nav-open');
    });
  });
})();

// ─── Scroll Reveal Animations ──────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Handle staggered children if present
        const stagger = entry.target.querySelector('[data-reveal-stagger]');
        if (stagger) {
          const children = stagger.children;
          [...children].forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.08}s`;
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));

  // Also stagger individual quest cards within quests section
  const quests = document.querySelectorAll('#quests .quest');
  quests.forEach((q, i) => {
    q.style.transitionDelay = `${i * 0.12}s`;
  });
})();

// ─── Typewriter Dialogue ────────────────────────────────────────────
(function initTypewriter() {
  const paragraphs = document.querySelectorAll('[data-typewriter]');
  if (!paragraphs.length) return;

  let currentIndex = 0;

  // Store original HTML and clear them initially
  const originalHTML = [];
  paragraphs.forEach((p, i) => {
    originalHTML[i] = p.innerHTML;
    p.innerHTML = '';
  });

  function typeWriter(element, html, speed, onComplete) {
    let i = 0;
    let output = '';

    function type() {
      if (i < html.length) {
        if (html[i] === '<') {
          const end = html.indexOf('>', i);
          output += html.substring(i, end + 1);
          i = end + 1;
        } else {
          output += html[i];
          i++;
        }
        element.innerHTML = output + '<span class="typewriter-cursor">▌</span>';

        // Pause slightly longer after punctuation
        const char = html[i - 1];
        const delay = (char === '.' || char === '!' || char === '?') ? speed * 4 :
                      (char === ',' || char === ';') ? speed * 1.5 : speed;
        setTimeout(type, delay);
      } else {
        element.innerHTML = output;
        if (onComplete) onComplete();
      }
    }

    type();
  }

  function typeNext() {
    if (currentIndex >= paragraphs.length) return;
    const p = paragraphs[currentIndex];
    const html = originalHTML[currentIndex];
    const delay = parseInt(p.getAttribute('data-typewriter-delay')) || 0;

    setTimeout(() => {
      typeWriter(p, html, 22, () => {
        currentIndex++;
        if (currentIndex < paragraphs.length) {
          const nextDelay = parseInt(paragraphs[currentIndex].getAttribute('data-typewriter-delay')) || 0;
          setTimeout(typeNext, Math.max(0, nextDelay - 400));
        }
      });
    }, delay);
  }

  // Start typing when about section is visible
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeNext, 600);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    observer.observe(aboutSection);
  }
})();

// ─── Back to Top Button ──────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── Mouse-reactive Hero Title ─────────────────────────────────────
(function initHeroGlow() {
  const title = document.getElementById('heroTitle');
  const hero = document.querySelector('.hero');
  if (!title || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    title.style.setProperty('--mouse-shadow-x', `${x * 12}px`);
    title.style.setProperty('--mouse-shadow-y', `${y * 12}px`);
    title.style.setProperty('--mouse-glow-x', `${x * -8}px`);
    title.style.setProperty('--mouse-glow-y', `${y * -8}px`);
  });

  hero.addEventListener('mouseleave', () => {
    title.style.setProperty('--mouse-shadow-x', '4px');
    title.style.setProperty('--mouse-shadow-y', '4px');
    title.style.setProperty('--mouse-glow-x', '0px');
    title.style.setProperty('--mouse-glow-y', '0px');
  });
})();

// ─── Parallax on Scroll ─────────────────────────────────────────────
(function initParallax() {
  const wrappers = document.querySelectorAll('.parallax-wrapper');
  if (!wrappers.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        wrappers.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.12;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ─── XP Bars ────────────────────────────────────────────────────────
(function initXPBars() {
  const items = document.querySelectorAll('.item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.xp-fill');
        const xp = entry.target.getAttribute('data-xp') || '50';
        fill.style.width = xp + '%';

        entry.target.setAttribute('role', 'progressbar');
        entry.target.setAttribute('aria-valuenow', xp);
        entry.target.setAttribute('aria-valuemin', '0');
        entry.target.setAttribute('aria-valuemax', '100');
        entry.target.setAttribute('aria-label', `Experience points: ${xp} percent`);

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  items.forEach(i => io.observe(i));
})();

// ─── Year ────────────────────────────────────────────────────────────
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
