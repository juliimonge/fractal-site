// =============================================
// FRACTAL DIGITAL SOLUTIONS
// Scroll-driven video experience
// =============================================

const FRAME_COUNT  = 121;
const FRAME_SPEED  = 2.2;    // video completes at ~45% scroll
const IMAGE_SCALE  = 0.88;   // padded cover mode — no hard crop
const FRAME_EXT    = 'jpg';

// ── State ────────────────────────────────────
const frames      = new Array(FRAME_COUNT);
let framesLoaded  = 0;
let currentFrame  = 0;

// ── Elements ─────────────────────────────────
const canvas      = document.getElementById('canvas');
const ctx         = canvas.getContext('2d');
const canvasWrap  = document.getElementById('canvas-wrap');
const hero        = document.getElementById('hero');
const scrollCont  = document.getElementById('scroll-container');
const loader      = document.getElementById('loader');
const loaderBar   = document.getElementById('loader-bar');
const loaderPct   = document.getElementById('loader-percent');
const siteHeader  = document.getElementById('site-header');
const darkOverlay = document.getElementById('dark-overlay');

// Phase overlay elements
const phaseEls = [
  { el: document.getElementById('phase-1'), start: 0.00, end: 0.23 },
  { el: document.getElementById('phase-2'), start: 0.23, end: 0.46 },
  { el: document.getElementById('phase-3'), start: 0.46, end: 0.67 },
  { el: document.getElementById('phase-4'), start: 0.67, end: 0.86 },
];

// ─────────────────────────────────────────────
// CANVAS
// ─────────────────────────────────────────────

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

function drawFrame(index) {
  const img = frames[index];
  if (!img) return;

  const cw    = window.innerWidth;
  const ch    = window.innerHeight;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * IMAGE_SCALE;
  const dw    = img.naturalWidth  * scale;
  const dh    = img.naturalHeight * scale;
  const dx    = (cw - dw) / 2;
  const dy    = (ch - dh) / 2;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ─────────────────────────────────────────────
// FRAME PRELOADER (two-phase)
// ─────────────────────────────────────────────

function pad4(n) { return String(n).padStart(4, '0'); }

function loadFrame(i, cb) {
  const img = new Image();
  img.src = `frames/frame_${pad4(i + 1)}.${FRAME_EXT}`;
  img.onload = () => {
    frames[i] = img;
    framesLoaded++;
    const pct = Math.round((framesLoaded / FRAME_COUNT) * 100);
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = pct + '%';
    if (cb) cb();
  };
  img.onerror = () => { framesLoaded++; if (cb) cb(); };
}

function preloadFrames() {
  const PHASE1 = Math.min(14, FRAME_COUNT);
  let p1Done   = 0;

  for (let i = 0; i < PHASE1; i++) {
    loadFrame(i, () => {
      if (i === 0 && frames[0]) drawFrame(0);
      p1Done++;
      if (p1Done === PHASE1) {
        for (let j = PHASE1; j < FRAME_COUNT; j++) {
          loadFrame(j, () => {
            if (framesLoaded >= FRAME_COUNT) hideLoader();
          });
        }
      }
    });
  }
}

function hideLoader() {
  gsap.to(loader, {
    opacity: 0, duration: 0.85, delay: 0.2, ease: 'power2.in',
    onComplete: () => { loader.style.display = 'none'; initSite(); }
  });
}

// ─────────────────────────────────────────────
// LENIS SMOOTH SCROLL
// ─────────────────────────────────────────────

let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ─────────────────────────────────────────────
// SECTION STATES
// ─────────────────────────────────────────────

const sectionStates = [];

// Elements animated in each section
const ANIM_SELECTOR = [
  '.section-label', '.section-heading', '.section-body',
  '.section-note',  '.cta-button',      '.stat',
  '.service-item',  '.process-step',    '.app-item',
  '.site-footer',
].join(', ');

function buildSectionStates() {
  document.querySelectorAll('.scroll-section').forEach(el => {
    const enter   = parseFloat(el.dataset.enter)   / 100;
    const leave   = parseFloat(el.dataset.leave)   / 100;
    const persist = el.dataset.persist === 'true';
    const anim    = el.dataset.animation;
    const children = Array.from(el.querySelectorAll(ANIM_SELECTOR));

    gsap.set(el, { opacity: 0 });
    const tl = buildTimeline(el, anim, children);

    sectionStates.push({ el, enter, leave, persist, tl, visible: false });
  });
}

function buildTimeline(el, type, children) {
  // Mark visible before creating from-tween so the section is shown
  gsap.set(el, { opacity: 1 });
  const tl = gsap.timeline({ paused: true });

  switch (type) {
    case 'slide-left':
      tl.from(children, { x: -65, opacity: 0, stagger: 0.13, duration: 0.9, ease: 'power3.out' });
      break;
    case 'slide-right':
      tl.from(children, { x: 65,  opacity: 0, stagger: 0.13, duration: 0.9, ease: 'power3.out' });
      break;
    case 'scale-up':
      tl.from(children, { scale: 0.88, opacity: 0, stagger: 0.12, duration: 1.0, ease: 'power2.out' });
      break;
    case 'rotate-in':
      tl.from(children, { y: 36, rotation: 2, opacity: 0, stagger: 0.11, duration: 0.9, ease: 'power3.out' });
      break;
    case 'stagger-up':
      tl.from(children, { y: 52, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out' });
      break;
    case 'clip-reveal':
      tl.from(children, { clipPath: 'inset(100% 0 0 0)', opacity: 0, stagger: 0.13, duration: 1.1, ease: 'power4.inOut' });
      break;
    case 'fade-up':
    default:
      tl.from(children, { y: 44, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
      break;
  }

  // Reset opacity to hidden — JS will reveal on enter
  gsap.set(el, { opacity: 0 });
  return tl;
}

// ─────────────────────────────────────────────
// MASTER TICK — called every scroll update
// ─────────────────────────────────────────────

function onScrollUpdate(p) {
  updateHero(p);
  updateFrame(p);
  updateOverlay(p, 0.40, 0.61);
  updatePhases(p);
  updateSections(p);
  updateMarquees(p);
}

// ── Hero + Canvas wipe ───────────────────────

function updateHero(p) {
  hero.style.opacity = Math.max(0, 1 - p * 18);

  // Expanding circle reveals canvas
  const wipeP  = Math.min(1, Math.max(0, (p - 0.005) / 0.075));
  canvasWrap.style.clipPath = `circle(${wipeP * 80}% at 50% 50%)`;

  // Header fades in as hero fades out
  siteHeader.style.opacity = Math.min(1, Math.max(0, (p - 0.04) / 0.05));
}

// ── Video frame scrub ────────────────────────

function updateFrame(p) {
  const idx = Math.min(
    Math.floor(Math.min(p * FRAME_SPEED, 1) * FRAME_COUNT),
    FRAME_COUNT - 1
  );
  if (idx !== currentFrame) {
    currentFrame = idx;
    requestAnimationFrame(() => drawFrame(currentFrame));
  }
}

// ── Dark overlay ─────────────────────────────

function updateOverlay(p, enterAt, leaveAt) {
  const fade = 0.035;
  let alpha  = 0;

  if (p >= enterAt - fade && p < enterAt)      alpha = (p - (enterAt - fade)) / fade;
  else if (p >= enterAt && p <= leaveAt)        alpha = 0.91;
  else if (p > leaveAt && p <= leaveAt + fade)  alpha = 0.91 * (1 - (p - leaveAt) / fade);

  darkOverlay.style.opacity = alpha;
}

// ── Phase overlay text ───────────────────────

function updatePhases(p) {
  const FADE = 0.03;
  phaseEls.forEach(({ el, start, end }) => {
    let alpha = 0;
    let ty    = 6;

    if (p >= start && p <= end) {
      if (p < start + FADE) {
        alpha = (p - start) / FADE;
        ty    = 6 * (1 - alpha);
      } else if (p > end - FADE) {
        alpha = (end - p) / FADE;
        ty    = 0;
      } else {
        alpha = 1;
        ty    = 0;
      }
    }

    el.style.opacity   = alpha;
    el.style.transform = `translateY(${ty}px)`;
  });
}

// ── Section visibility ───────────────────────

function updateSections(p) {
  sectionStates.forEach(state => {
    const inWindow = p >= state.enter && (state.persist || p < state.leave);

    if (inWindow && !state.visible) {
      state.visible = true;
      state.el.style.opacity = 1;
      state.tl.play();
    } else if (!inWindow && state.visible && !state.persist) {
      state.visible = false;
      state.tl.reverse();
    }
  });
}

// ── Marquees ─────────────────────────────────

function updateMarquees(p) {
  const SHOW_START = 0.09;
  const SHOW_END   = 0.80;
  const FADE_DUR   = 0.05;

  let alpha = 0;
  if (p >= SHOW_START && p <= SHOW_END) {
    if (p < SHOW_START + FADE_DUR)    alpha = (p - SHOW_START) / FADE_DUR;
    else if (p > SHOW_END - FADE_DUR) alpha = (SHOW_END - p)   / FADE_DUR;
    else                               alpha = 1;
  }
  alpha = Math.max(0, Math.min(1, alpha));

  ['marquee-1', 'marquee-2'].forEach(id => {
    const wrap = document.getElementById(id);
    const text = wrap.querySelector('.marquee-text');
    const spd  = parseFloat(wrap.dataset.scrollSpeed);
    wrap.style.opacity = alpha;
    gsap.set(text, { x: p * spd });
  });
}

// ─────────────────────────────────────────────
// HERO ENTRANCE ANIMATION (on load)
// ─────────────────────────────────────────────

function animateHeroIn() {
  const label    = hero.querySelector('.hero-label');
  const words    = hero.querySelectorAll('.hero-heading .word');
  const tagline  = hero.querySelector('.hero-tagline');
  const rule     = hero.querySelector('.hero-rule');
  const scroller = hero.querySelector('.scroll-indicator');

  const tl = gsap.timeline({ delay: 0.5 });

  tl.from(label,   { y: 18, opacity: 0, duration: 0.75, ease: 'power3.out' })
    .from(words,   { y: 90, opacity: 0, duration: 1.25, ease: 'power3.out', stagger: 0.1 }, '-=0.25')
    .from(tagline, { y: 22, opacity: 0, duration: 0.8,  ease: 'power3.out' }, '-=0.55')
    .from(rule,    { scaleX: 0, opacity: 0, duration: 0.7, ease: 'power3.out', transformOrigin: 'left center' }, '-=0.4')
    .from(scroller,{ y: 14, opacity: 0, duration: 0.6,  ease: 'power2.out' }, '-=0.3');

  gsap.from(siteHeader, { y: -10, opacity: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function initSite() {
  gsap.registerPlugin(ScrollTrigger);
  initLenis();
  resizeCanvas();
  buildSectionStates();
  animateHeroIn();

  // One master ScrollTrigger drives the entire experience
  ScrollTrigger.create({
    trigger: scrollCont,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => onScrollUpdate(self.progress),
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    ScrollTrigger.refresh();
  });
}

// ── Boot ──────────────────────────────────────
preloadFrames();
