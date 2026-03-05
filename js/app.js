// =============================================
// FRACTAL — Ultra-Luxury Real Estate Marketing
// Scroll-driven video experience
// =============================================

const FRAME_COUNT = 121;
const FRAME_SPEED = 2.2;       // completes video by ~45% scroll
const IMAGE_SCALE = 0.88;      // padded cover — no hard clip
const FRAME_EXT  = 'jpg';

// ── State ────────────────────────────────────
const frames      = new Array(FRAME_COUNT);
let framesLoaded  = 0;
let currentFrame  = 0;
let allReady      = false;

// ── Elements ─────────────────────────────────
const canvas        = document.getElementById('canvas');
const ctx           = canvas.getContext('2d');
const canvasWrap    = document.getElementById('canvas-wrap');
const heroSection   = document.getElementById('hero');
const scrollCont    = document.getElementById('scroll-container');
const loader        = document.getElementById('loader');
const loaderBar     = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');
const siteHeader    = document.getElementById('site-header');
const darkOverlay   = document.getElementById('dark-overlay');

// ── Canvas Setup ─────────────────────────────
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const W   = window.innerWidth;
  const H   = window.innerHeight;
  canvas.width        = W * dpr;
  canvas.height       = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(currentFrame);
}

// ── Frame Rendering ───────────────────────────
function drawFrame(index) {
  const img = frames[index];
  if (!img) return;

  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ── Frame Loading ─────────────────────────────
function pad4(n) { return String(n).padStart(4, '0'); }

function loadFrame(i, cb) {
  const img = new Image();
  img.src = `frames/frame_${pad4(i + 1)}.${FRAME_EXT}`;
  img.onload = () => {
    frames[i] = img;
    framesLoaded++;
    const pct = Math.round((framesLoaded / FRAME_COUNT) * 100);
    loaderBar.style.width = pct + '%';
    loaderPercent.textContent = pct + '%';
    if (cb) cb();
  };
  img.onerror = () => {
    framesLoaded++;
    if (cb) cb();
  };
}

function preloadFrames() {
  let phase1Count = 0;
  const PHASE1 = Math.min(12, FRAME_COUNT);

  for (let i = 0; i < PHASE1; i++) {
    loadFrame(i, () => {
      if (i === 0 && frames[0]) drawFrame(0);
      phase1Count++;
      if (phase1Count === PHASE1) {
        // Phase 2 — background load remaining
        for (let j = PHASE1; j < FRAME_COUNT; j++) {
          loadFrame(j, () => {
            if (framesLoaded >= FRAME_COUNT) {
              allReady = true;
              hideLoader();
            }
          });
        }
      }
    });
  }
}

function hideLoader() {
  gsap.to(loader, {
    opacity: 0,
    duration: 0.9,
    delay: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      loader.style.display = 'none';
      initSite();
    }
  });
}

// ── Lenis Smooth Scroll ───────────────────────
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── Section Config ────────────────────────────
// Each entry mirrors a .scroll-section in the DOM
const sectionStates = [];

function buildSectionStates() {
  document.querySelectorAll('.scroll-section').forEach(el => {
    const enter   = parseFloat(el.dataset.enter)   / 100;
    const leave   = parseFloat(el.dataset.leave)   / 100;
    const anim    = el.dataset.animation;
    const persist = el.dataset.persist === 'true';

    const children = Array.from(el.querySelectorAll(
      '.section-label, .section-heading, .section-body, .section-note, .cta-button, .stat'
    ));

    gsap.set(el, { opacity: 0 });
    gsap.set(children, clearProps());

    const tl = buildTimeline(el, anim, children);

    sectionStates.push({ el, enter, leave, persist, tl, visible: false, countersDone: false });
  });
}

function clearProps() {
  return { clearProps: 'all' };
}

function buildTimeline(el, type, children) {
  const tl = gsap.timeline({ paused: true });
  gsap.set(el, { opacity: 1 });

  switch (type) {
    case 'slide-left':
      tl.from(children, { x: -70, opacity: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
      break;
    case 'slide-right':
      tl.from(children, { x: 70, opacity: 0, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
      break;
    case 'scale-up':
      tl.from(children, { scale: 0.88, opacity: 0, stagger: 0.12, duration: 1.0, ease: 'power2.out' });
      break;
    case 'rotate-in':
      tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.11, duration: 0.9, ease: 'power3.out' });
      break;
    case 'stagger-up':
      tl.from(children, { y: 55, opacity: 0, stagger: 0.14, duration: 0.85, ease: 'power3.out' });
      break;
    case 'clip-reveal':
      tl.from(children, {
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
        stagger: 0.14,
        duration: 1.1,
        ease: 'power4.inOut'
      });
      break;
    case 'fade-up':
    default:
      tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
      break;
  }

  gsap.set(el, { opacity: 0 });
  return tl;
}

// ── Counter Animation ─────────────────────────
function animateCounters(statsSection) {
  statsSection.el.querySelectorAll('.stat-number').forEach(num => {
    const target   = parseFloat(num.dataset.value);
    const decimals = parseInt(num.dataset.decimals || '0');
    const obj      = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power1.out',
      onUpdate() {
        num.textContent = obj.val.toFixed(decimals);
      },
      onComplete() {
        num.textContent = target.toFixed(decimals);
      }
    });
  });
}

// ── Tick: single update function ─────────────
function onScrollUpdate(progress) {

  // 1. Hero + canvas circle-wipe
  updateHero(progress);

  // 2. Canvas frame
  updateFrame(progress);

  // 3. Dark overlay (stats window: 0.48 → 0.68)
  updateOverlay(progress, 0.48, 0.68);

  // 4. Section visibility
  updateSections(progress);

  // 5. Marquees
  updateMarquees(progress);
}

// ── Hero Transition ───────────────────────────
function updateHero(p) {
  // Fade hero out fast at scroll start
  const heroAlpha = Math.max(0, 1 - p * 18);
  heroSection.style.opacity = heroAlpha;

  // Expand canvas circle-wipe
  const wipeP  = Math.min(1, Math.max(0, (p - 0.005) / 0.07));
  const radius = wipeP * 80;
  canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;

  // Fade in site header once hero disappears
  const headerAlpha = Math.min(1, Math.max(0, (p - 0.04) / 0.04));
  siteHeader.style.opacity = headerAlpha;
}

// ── Frame Scrubbing ───────────────────────────
function updateFrame(p) {
  const accelerated = Math.min(p * FRAME_SPEED, 1);
  const index       = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
  if (index !== currentFrame) {
    currentFrame = index;
    requestAnimationFrame(() => drawFrame(currentFrame));
  }
}

// ── Dark Overlay ──────────────────────────────
function updateOverlay(p, enterP, leaveP) {
  const fade = 0.035;
  let alpha  = 0;

  if (p >= enterP - fade && p < enterP) {
    alpha = (p - (enterP - fade)) / fade;
  } else if (p >= enterP && p <= leaveP) {
    alpha = 0.92;
  } else if (p > leaveP && p <= leaveP + fade) {
    alpha = 0.92 * (1 - (p - leaveP) / fade);
  }

  darkOverlay.style.opacity = alpha;
}

// ── Section Visibility ────────────────────────
function updateSections(p) {
  sectionStates.forEach(state => {
    const inWindow = p >= state.enter && (state.persist || p < state.leave);

    if (inWindow && !state.visible) {
      state.visible = true;
      state.el.style.opacity = 1;
      state.tl.play();

      // Trigger counters on stats section (stagger-up, has .stat-number)
      if (!state.countersDone && state.el.querySelector('.stat-number')) {
        state.countersDone = true;
        setTimeout(() => animateCounters(state), 200);
      }
    } else if (!inWindow && state.visible && !state.persist) {
      state.visible = false;
      state.tl.reverse();
    }
  });
}

// ── Marquees ─────────────────────────────────
function updateMarquees(p) {
  const m1 = document.getElementById('marquee-1');
  const m2 = document.getElementById('marquee-2');

  const visStart = 0.10;
  const visEnd   = 0.78;
  const fadeDur  = 0.05;

  let alpha = 0;
  if (p >= visStart && p <= visEnd) {
    if (p < visStart + fadeDur) {
      alpha = (p - visStart) / fadeDur;
    } else if (p > visEnd - fadeDur) {
      alpha = (visEnd - p) / fadeDur;
    } else {
      alpha = 1;
    }
  }

  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  m1.style.opacity = clampedAlpha;
  m2.style.opacity = clampedAlpha;

  // Move marquee text
  const m1Text = m1.querySelector('.marquee-text');
  const m2Text = m2.querySelector('.marquee-text');

  const speed1 = parseFloat(m1.dataset.scrollSpeed);
  const speed2 = parseFloat(m2.dataset.scrollSpeed);

  gsap.set(m1Text, { x: p * speed1 });
  gsap.set(m2Text, { x: p * speed2 });
}

// ── Hero Entrance ─────────────────────────────
function animateHeroIn() {
  const label    = heroSection.querySelector('.hero-label');
  const words    = heroSection.querySelectorAll('.hero-heading .word');
  const tagline  = heroSection.querySelector('.hero-tagline');
  const rule     = heroSection.querySelector('.hero-rule');
  const scroll   = heroSection.querySelector('.scroll-indicator');

  const tl = gsap.timeline({ delay: 0.4 });
  tl.to(label,  { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', from: { y: 20, opacity: 0 } })
    .from(words,   { y: 100, opacity: 0, duration: 1.3, ease: 'power3.out', stagger: 0.08 }, '-=0.2')
    .from(tagline, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from(rule,    { scaleX: 0, opacity: 0, duration: 0.7, ease: 'power3.out', transformOrigin: 'left center' }, '-=0.4')
    .from(scroll,  { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  // Animate header in
  gsap.to(siteHeader, { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out', from: { y: -10, opacity: 0 } });
}

// ── Main Init ─────────────────────────────────
function initSite() {
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  resizeCanvas();
  buildSectionStates();
  animateHeroIn();

  // Master scroll trigger — one for everything
  ScrollTrigger.create({
    trigger: scrollCont,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => onScrollUpdate(self.progress)
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    ScrollTrigger.refresh();
  });
}

// ── Boot ──────────────────────────────────────
preloadFrames();
