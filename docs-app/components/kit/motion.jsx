'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

/* Tollerud DS — Motion & interaction layer. Decoupled, global, and fully
   reduced-motion aware. → window.{initMotion, CountUp, Typewriter, PageTOC, useReveal} */

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────────────────────────────────────────────
   Scroll reveal — a single global IntersectionObserver watches any
   element with [data-reveal] and adds .is-revealed when it enters.
   A MutationObserver picks up nodes React mounts after route changes.
   Stagger is expressed via the --reveal-i custom property in CSS.
   ─────────────────────────────────────────────────────────────── */
let _revealIO = null;
function initReveal() {
  const disabled = document.documentElement.hasAttribute('data-no-reveal') || window.TOLLERUD_NO_REVEAL;
  if (REDUCED || disabled) {
    // reveal everything immediately, and keep doing so for new nodes
    const showAll = () => document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
    showAll();
    new MutationObserver(showAll).observe(document.body, { childList: true, subtree: true });
    return;
  }
  _revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-revealed'); _revealIO.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  const scan = () => document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(el => {
    // stagger siblings that share a parent
    if (!el.style.getPropertyValue('--reveal-i')) {
      const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      el.style.setProperty('--reveal-i', sibs.indexOf(el));
    }
    _revealIO.observe(el);
  });
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

/* ───────────────────────────────────────────────────────────────
   Magnetic glow — primary & terminal buttons get a soft yellow light
   that follows the pointer. Event-delegated; one set of listeners.
   ─────────────────────────────────────────────────────────────── */
function initGlow() {
  if (REDUCED) return;
  const sel = '.tollerud-btn--primary, .tollerud-btn--terminal, .ds-glow';
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest && e.target.closest(sel);
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--glow-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    t.style.setProperty('--glow-y', `${((e.clientY - r.top) / r.height) * 100}%`);
    t.classList.add('is-glowing');
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest && e.target.closest(sel);
    if (t) t.classList.remove('is-glowing');
  });
}

/* ───────────────────────────────────────────────────────────────
   Tilt — subtle 3D parallax on [data-tilt] cards.
   ─────────────────────────────────────────────────────────────── */
function initTilt() {
  if (REDUCED) return;
  document.addEventListener('pointermove', (e) => {
    const t = e.target.closest && e.target.closest('[data-tilt]');
    if (!t) return;
    const r = t.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = `perspective(800px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest && e.target.closest('[data-tilt]');
    if (t) t.style.transform = '';
  });
}

function initMotion() { initReveal(); initGlow(); initTilt(); }

/* ───────────────────────────────────────────────────────────────
   CountUp — animates a number when it scrolls into view.
   ─────────────────────────────────────────────────────────────── */
function CountUp({ value, duration = 1100, prefix = '', suffix = '', decimals = 0, className, style }) {
  const ref = useRef(null);
  const [disp, setDisp] = useState(REDUCED ? value : 0);
  useEffect(() => {
    if (REDUCED) { setDisp(value); return; }
    const el = ref.current; if (!el) return;
    let raf, started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisp(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  const shown = decimals ? disp.toFixed(decimals) : Math.round(disp).toLocaleString();
  return <span ref={ref} className={className} style={style}>{prefix}{shown}{suffix}</span>;
}

/* ───────────────────────────────────────────────────────────────
   Typewriter — types/erases a rotating list of lines. Terminal vibe.
   ─────────────────────────────────────────────────────────────── */
function Typewriter({ lines, typeSpeed = 52, pause = 1400, className, style }) {
  const [text, setText] = useState(REDUCED ? lines[0] : '');
  const [i, setI] = useState(0);
  useEffect(() => {
    if (REDUCED) return;
    let timer; let phase = 'typing'; let pos = 0; let cur = 0;
    const run = () => {
      const full = lines[cur];
      if (phase === 'typing') {
        pos++; setText(full.slice(0, pos));
        if (pos === full.length) { phase = 'hold'; timer = setTimeout(run, pause); return; }
        timer = setTimeout(run, typeSpeed + Math.random() * 40);
      } else if (phase === 'hold') {
        phase = 'erasing'; timer = setTimeout(run, 30);
      } else {
        pos--; setText(full.slice(0, pos));
        if (pos === 0) { cur = (cur + 1) % lines.length; setI(cur); phase = 'typing'; timer = setTimeout(run, 220); return; }
        timer = setTimeout(run, 26);
      }
    };
    timer = setTimeout(run, 500);
    return () => clearTimeout(timer);
  }, []);
  return <span className={className} style={style}>{text}<span className="ds-caret" aria-hidden="true"/></span>;
}

/* ───────────────────────────────────────────────────────────────
   PageTOC — scroll-spy table of contents built from .ds-section
   headings inside .ds-content. Re-scans on route change.
   ─────────────────────────────────────────────────────────────── */
function PageTOC({ route }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => {
    let io;
    const scan = () => {
      const secs = [...document.querySelectorAll('.ds-content .ds-section')];
      const list = secs.map((s, idx) => {
        if (!s.id) s.id = 'sec-' + idx;
        const t = s.querySelector('.ds-section__title');
        return { id: s.id, label: t ? t.textContent : 'Section ' + (idx + 1) };
      }).filter(x => x.label);
      setItems(list);
      if (io) io.disconnect();
      io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });
      secs.forEach(s => io.observe(s));
      if (list[0]) setActive(a => a || list[0].id);
    };
    const t = setTimeout(scan, 120);
    return () => { clearTimeout(t); if (io) io.disconnect(); };
  }, [route]);

  if (items.length < 3) return null;
  const jump = (id) => jumpToSection(id);
  return (
    <nav className="ds-toc" aria-label="On this page">
      <div className="ds-toc__label">On this page</div>
      <ul className="ds-toc__list">
        {items.map(it => (
          <li key={it.id}>
            <button className={`ds-toc__link ${active === it.id ? 'is-active' : ''}`} onClick={() => jump(it.id)}>{it.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { initMotion, CountUp, Typewriter, PageTOC };
export const MOTION_REDUCED = REDUCED;
