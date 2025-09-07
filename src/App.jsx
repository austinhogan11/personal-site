import { useEffect, useState, useMemo } from "react";
// Shared section list and observer options used by both nav components
const SECTIONS = [
  { id: "top", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contact", label: "Contact" },
];

// Scroll spy root margin and glow sizing tokens
const SCROLL_ROOT_MARGIN = "-40% 0px -55% 0px";
// Rebuild observer options to reference the shared margin
const OBSERVER_OPTIONS = { rootMargin: SCROLL_ROOT_MARGIN, threshold: [0, 0.25, 0.5, 1] };

const GLOW_MAX_SHIFT = 1.6;
const GLOW_MAX_SHIFT_HERO = 1.2; // hero card has a slightly gentler parallax

const GLOW_SIZE = {
  HERO: 180,
  EXPERIENCE: 320,
  PROJECTS: 340,
  EDUCATION: 320,
  HOBBIES: 280,
  CONTACT: 320,
};
// --- Shared UI tokens/components -------------------------------------------------
const CARD_BASE = "relative overflow-hidden rounded-xl border border-token bg-card/70 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover-accent focus-accent hover:-translate-y-1 hover:shadow-lg";

function Card({ className = "", children }) {
  return <div className={`${CARD_BASE} ${className}`}>{children}</div>;
}

function TagChip({ as = 'span', className = '', children }) {
  const Tag = as;
  return (
    <Tag className={`rounded bg-card border border-token px-2 py-0.5 ${className}`}>{children}</Tag>
  );
}

function IconGitHub({ className = "", ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.7.3-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.4 5.9.4.3.7.9.7 1.9v2.9c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  );
}

function IconLinkedIn({ className = "", ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.08V23h-4v-5.71c0-1.36-.02-3.11-1.9-3.11-1.9 0-2.19 1.49-2.19 3.02V23h-4V8.5z"/>
    </svg>
  );
}

function IconMail({ className = "", ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13 20 6.01V6H4zm0 12h16V8l-8 7-8-7v10z"/>
    </svg>
  );
}
// -------------------------------------------------------------------------------
/*
  Personal site App.jsx
  ---------------------
  Overview of what this file implements:
  - GlowAccents: lightweight background glow blobs with optional pointer parallax.
  - ScrollSpyNav / ScrollSpyTopNav: side rail and top nav that highlight the section in view via IntersectionObserver.
  - App(): page shell, theme bootstrap, Duolingo streak demo counter, scroll progress bar, and all sections (Hero, Experience, Projects, Education, Hobbies, Contact).

  Design goals we implemented:
  - Subtle, performant motion (prefers-reduced-motion respected).
  - Dark-first theme with soft amber/indigo highlights and hover/focus “glow” accents.
  - Accessible semantics: aria labels, focus styles, reduced motion checks, and visible indicators for the active section.
*/
// Decorative background gradients used behind cards/sections; very cheap to render.
function GlowAccents({ size = 160, parallax = false, maxShift = 1.6 }) {
  // Two small pools of gradient combos. Keeping class strings static ensures Tailwind includes them in the build.
  const topCombos = [
    "bg-gradient-to-br from-sky-500/10 via-fuchsia-500/10 to-transparent",
    "bg-gradient-to-br from-violet-500/10 via-sky-400/10 to-transparent",
    "bg-gradient-to-br from-indigo-500/10 via-rose-500/10 to-transparent",
    "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent",
  ];
  const bottomCombos = [
    "bg-gradient-to-tr from-amber-200/10 via-sky-400/10 to-transparent",
    "bg-gradient-to-tr from-emerald-300/10 via-cyan-400/10 to-transparent",
    "bg-gradient-to-tr from-fuchsia-300/10 via-indigo-400/10 to-transparent",
    "bg-gradient-to-tr from-rose-300/10 via-violet-400/10 to-transparent",
  ];

  // Randomize the variant once per mount so each card looks slightly unique but remains stable across re-renders.
  const pick = useMemo(() => ({
    topIdx: Math.floor(Math.random() * topCombos.length),
    botIdx: Math.floor(Math.random() * bottomCombos.length),
    // slight jitter for position/size so cards vary subtly
    topOffset: {
      top: -10 - Math.floor(Math.random() * 8), // px
      left: -16 - Math.floor(Math.random() * 10),
    },
    botOffset: {
      bottom: -12 - Math.floor(Math.random() * 8),
      right: -16 - Math.floor(Math.random() * 10),
    },
    scale: 1 + Math.random() * 0.25, // 1.0 - 1.25
  }), []);

  // Parallax effect (tiny, motion-safe)
  const [shift, setShift] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!parallax || typeof window === 'undefined') return;
    // Respect the user's reduced motion preference and skip the tiny parallax if set.
    const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;
    let raf = 0;
    // Map pointer position to a tiny X/Y shift (maxShift ~1–2px) and throttle via rAF.
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * (maxShift * 2);
      const ny = (e.clientY / window.innerHeight - 0.5) * (maxShift * 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShift({ x: nx, y: ny }));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [parallax, maxShift]);

  const dim = size * pick.scale;

  return (
    <>
      {/* Two layered blobs (top-left and bottom-right) to create soft depth */}
      <div
        aria-hidden
        className={`pointer-events-none absolute rounded-full blur-2xl will-change-transform ${topCombos[pick.topIdx]}`}
        style={{
          top: `${pick.topOffset.top}px`,
          left: `${pick.topOffset.left}px`,
          width: `${dim}px`,
          height: `${dim}px`,
          transform: `translate3d(${shift.x}px, ${shift.y}px, 0)`,
        }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute rounded-full blur-2xl will-change-transform ${bottomCombos[pick.botIdx]}`}
        style={{
          bottom: `${pick.botOffset.bottom}px`,
          right: `${pick.botOffset.right}px`,
          width: `${dim}px`,
          height: `${dim}px`,
          transform: `translate3d(${shift.x}px, ${shift.y}px, 0)`,
        }}
      />
    </>
  );
}

// Left rail navigation for large screens. Highlights the section currently intersecting the viewport.
function ScrollSpyNav() {
  // Order must match the section IDs used below in the page content.
  const [active, setActive] = useState("top");


  useEffect(() => {
    // Observe each section and set `active` to the one that crosses our center-ish rootMargin.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      OBSERVER_OPTIONS
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Section navigation" className="relative hidden lg:flex lg:flex-col gap-8 text-sm select-none">
      {/* vertical guide rail */}
      <div className="absolute top-0 bottom-0 left-[7px] w-px bg-token/40" aria-hidden />
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id ? 'page' : undefined}
          className="group relative pl-6 flex items-center"
        >
          {/* dot */}
          <span
            className={`absolute left-0 h-3.5 w-3.5 rounded-full transition-all ${
              active === s.id
                ? 'bg-bg border-2 scale-125 border-blue-900 shadow-[0_0_12px_rgba(30,58,138,0.45)] dark:border-amber-200 dark:shadow-[0_0_12px_rgba(253,230,138,0.6)]'
                : 'bg-bg border border-token group-hover:border-blue-900 dark:group-hover:border-amber-200 group-hover:shadow-[0_0_12px_rgba(30,58,138,0.45)] dark:group-hover:shadow-[0_0_12px_rgba(253,230,138,0.6)]'
            }`}
            aria-hidden
          />
          {/* label (fades in on hover) */}
          <span
            className={`ml-2 px-0.5 transition-colors ${
              active === s.id
                ? 'font-semibold text-blue-900 dark:text-amber-200 drop-shadow-[0_0_6px_rgba(30,58,138,0.45)] dark:drop-shadow-[0_0_6px_rgba(253,230,138,0.6)]'
                : 'text-muted opacity-60'
            } group-hover:opacity-100 group-hover:text-blue-900 dark:group-hover:text-amber-200 group-hover:drop-shadow-[0_0_6px_rgba(30,58,138,0.45)] dark:group-hover:drop-shadow-[0_0_6px_rgba(253,230,138,0.6)]`}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

// Compact top nav for small screens; same logic as the left rail but horizontally scrollable.
function ScrollSpyTopNav() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    // Same intersection logic as the desktop rail.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      OBSERVER_OPTIONS
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="lg:hidden sticky top-0 z-10 bg-bg/80 backdrop-blur border-b border-token">
      <div className="mx-auto max-w-[1100px] px-4 overflow-x-auto">
        <ul className="flex items-center gap-6 py-3">
          {SECTIONS.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} aria-current={active === s.id ? 'page' : undefined} className="group inline-flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    active === s.id
                      ? 'bg-bg border-2 border-blue-900 shadow-[0_0_8px_rgba(30,58,138,0.45)] dark:border-amber-200 dark:shadow-[0_0_8px_rgba(253,230,138,0.6)]'
                      : 'bg-bg border border-token group-hover:border-blue-900 dark:group-hover:border-amber-200 group-hover:shadow-[0_0_8px_rgba(30,58,138,0.45)] dark:group-hover:shadow-[0_0_8px_rgba(253,230,138,0.6)]'
                  }`}
                  aria-hidden
                />
                <span className={`${active === s.id ? 'font-medium text-blue-900 dark:text-amber-200 drop-shadow-[0_0_6px_rgba(30,58,138,0.45)] dark:drop-shadow-[0_0_6px_rgba(253,230,138,0.6)]' : 'text-muted'} text-sm group-hover:text-blue-900 dark:group-hover:text-amber-200 group-hover:drop-shadow-[0_0_6px_rgba(30,58,138,0.45)] dark:group-hover:drop-shadow-[0_0_6px_rgba(253,230,138,0.6)]`}>
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Page shell: sets theme/motion, computes demo counters, and renders all sections.
export default function App() {
  useEffect(() => {
    // Add a tiny style tag at runtime so we can enable smooth scrolling unless the user prefers reduced motion.
    const style = document.createElement('style');
    const prefersReduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    style.textContent = prefersReduce
      ? 'html{font-size:90%}'
      : 'html{scroll-behavior:smooth;font-size:90%}';
    document.head.appendChild(style);
    // Default to dark theme on first load; your CSS uses `.dark` to switch tokens.
    document.documentElement.classList.add('dark');
    return () => {
      if (style && style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  // Demo: live Duolingo streak counter that increments by calendar day using localStorage as an anchor.
  const [duoStreak, setDuoStreak] = useState(1002);
  useEffect(() => {
    // Compute days since a stored base date (or initialize it) and add to the base count.
    const today = new Date();
    const keyBase = 'duoBaseDate';
    const keyCount = 'duoBaseCount';
    let baseDateStr = localStorage.getItem(keyBase);
    let baseCount = parseInt(localStorage.getItem(keyCount) || '1002', 10);
    if (!baseDateStr) {
      baseDateStr = today.toDateString();
      localStorage.setItem(keyBase, baseDateStr);
      localStorage.setItem(keyCount, String(baseCount));
    }
    const baseDate = new Date(baseDateStr);
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((today.setHours(0,0,0,0) - baseDate.setHours(0,0,0,0)) / msPerDay);
    setDuoStreak(baseCount + Math.max(0, days));
  }, []);

  // Scroll progress bar at the very top of the page.
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    // Track scroll position as a percentage of total document height with rAF throttling.
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize in case the user lands on a scrolled position
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Fixed top progress bar that fills as you scroll */}
      <div
        className="fixed top-0 left-0 h-1 bg-amber-300 dark:bg-amber-200 z-50 transition-all duration-150 shadow-[0_0_8px_rgba(253,230,138,.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
      {/* Quick actions: GitHub, LinkedIn, Email */}
      <div className="fixed top-3 right-3 z-20 flex flex-col items-end gap-2">
        <a
          href="https://github.com/austinhogan11"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub Profile"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle group inline-grid place-items-center w-9 h-9 text-muted transition-shadow transition-colors border border-zinc-400 dark:border-zinc-500 hover-accent focus-accent"
        >
          <IconGitHub className="w-5 h-5 transition-colors" />
        </a>
        <a
          href="https://www.linkedin.com/in/austin-hogan-663164151/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn Profile"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle group inline-grid place-items-center w-9 h-9 text-muted transition-shadow transition-colors border border-zinc-400 dark:border-zinc-500 hover-accent focus-accent"
        >
          <IconLinkedIn className="w-5 h-5 transition-colors" />
        </a>
        <a
          href="mailto:austinhogan15@gmail.com"
          aria-label="Email Austin Hogan"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle group inline-grid place-items-center w-9 h-9 text-muted transition-shadow transition-colors border border-zinc-400 dark:border-zinc-500 hover-accent focus-accent"
        >
          <IconMail className="w-5 h-5 transition-colors" />
        </a>
      </div>
      <div className="grid lg:grid-cols-[auto_1fr]">
        {/* Desktop left rail scroll‑spy */}
        <aside className="sticky top-0 h-[100svh] hidden lg:flex items-center justify-start pl-6">
          <ScrollSpyNav />
        </aside>
        <main className="pb-16 mx-auto max-w-[1100px] px-4">
          <ScrollSpyTopNav />
          <section id="top" className="relative mx-auto max-w-6xl px-4 pt-16 sm:pt-24 pb-8 sm:pb-10 scroll-mt-24">
            {/* soft background glow accents behind the hero */}
            <div aria-hidden className="pointer-events-none absolute -top-10 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/10 via-fuchsia-500/10 to-transparent blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-16 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200/10 via-sky-400/10 to-transparent blur-2xl" />
            <div className="grid gap-10 md:grid-cols-[1.65fr_1.1fr] md:gap-12 items-start">
              <div className="relative z-[1]">
                <h1 className="text-[36px] sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="block text-amber-200 drop-shadow-[0_0_16px_rgba(253,230,138,0.6)]">Austin Hogan</span>
                  <span className="relative inline-block">
                  <span className="relative z-10 block bg-clip-text text-transparent
                    bg-gradient-to-r from-indigo-300 via-indigo-200 to-sky-300
                    dark:from-fuchsia-300 dark:via-violet-200 dark:to-sky-300
                    leading-[1.12] sm:leading-[1.08] pb-1">
                      Software Engineer &amp; Builder
                    </span>
                  </span>
                </h1>
              <div className="mt-5 max-w-3xl space-y-2 pl-4 border-l border-blue-900/20 dark:border-amber-200/25">
                <p className="text-[16px] md:text-[17px] leading-[1.5] font-medium text-white">Cloud DevOps Engineer for Macy’s.</p>
                <p className="text-[16px] md:text-[17px] leading-[1.5] font-medium text-white">Building CHSN Running Platform.</p>
                <p className="text-[16px] md:text-[17px] leading-[1.5] font-medium text-white">
                  Runner &amp; Coach at{' '}
                  <a
                    href="https://www.instagram.com/chsnrunning/"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-baseline underline decoration-transparent hover:decoration-current transition-[text-decoration-color]"
                  >
                    CHSN Running
                    <span className="inline-block w-0 overflow-hidden opacity-0 -translate-x-0 group-hover:w-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all">↗</span>
                  </a>.
                </p>
              </div>


                <div className="mt-8 flex gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-amber-300/30 dark:border-amber-200/30 text-blue-950 dark:text-blue-900 bg-amber-300 dark:bg-amber-200 hover:bg-amber-200 dark:hover:bg-amber-100 shadow-[0_0_18px_rgba(253,230,138,.35)] hover:shadow-[0_0_24px_rgba(253,230,138,.5)] transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/60 dark:focus:ring-amber-200/60"
                  >
                    View Projects
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-token text-white bg-transparent hover-accent focus-accent transition-all"
                  >
                    Get in touch
                  </a>
                </div>
              </div>

              {/* Quick details card with glow accents and fast facts */}
              <Card className="p-5 md:p-6">
                {/* gentle radial behind the title */}
                <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-400/10 via-fuchsia-400/10 to-transparent blur-3xl" />

                <h2 className="font-semibold tracking-wide text-amber-200 drop-shadow-[0_0_12px_rgba(253,230,138,0.5)]">At a glance</h2>

                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted">Location</dt>
                    <dd className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">Atlanta, GA</dd>
                  </div>

                  <div>
                    <dt className="text-muted">Email</dt>
                    <dd>
                      <a
                        href="mailto:austinhogan15@gmail.com"
                        className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)] underline underline-offset-2 decoration-transparent hover:decoration-current break-all xl:break-normal xl:whitespace-nowrap"
                      >
                        austinhogan15@gmail.com
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted">Studying</dt>
                    <dd>
                      <a href="https://roadmap.sh/devops" target="_blank" rel="noreferrer"
                         className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)] underline decoration-transparent hover:decoration-current">
                        DevOps on Roadmap.sh
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted">Reading</dt>
                    <dd className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]"><span className="italic">Go One More</span> by Nick Bare</dd>
                  </div>

                  <div className="sm:col-span-2 pt-2 mt-1 border-t border-token/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <dt className="text-muted">Duolingo Spanish Streak</dt>
                        <dd className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]"><span className="font-semibold">{duoStreak}</span> days</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Training for</dt>
                        <dd className="text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">Sub‑3 Hour Marathon</dd>
                      </div>
                    </div>
                  </div>
                </dl>
                {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
                <GlowAccents size={GLOW_SIZE.HERO} parallax maxShift={GLOW_MAX_SHIFT_HERO} />
              </Card>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Experience */}
          <section id="experience" className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 scroll-mt-24">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
              <GlowAccents size={GLOW_SIZE.EXPERIENCE} parallax maxShift={GLOW_MAX_SHIFT} />
            </div>
            <div className="relative z-[1]">
              {/* Experience timeline/card */}
              <h2 className="text-2xl font-bold tracking-tight text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_16px_rgba(253,230,138,0.55)]">Experience</h2>
              <div className="mt-6 space-y-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Software Engineer (Cloud DevOps / Platform)</h3>
                      <p className="text-base text-muted">Macy’s Inc.</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-muted">June 2021 – Present</span>
                      <span className="block text-sm text-muted">Atlanta, GA</span>
                    </div>
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Provisioned and managed scalable Google Cloud infrastructure using Terraform, ensuring repeatable, secure deployments for data-focused applications.</li>
                    <li>Led 24/7 on-call incident response for production and non-production environments, reducing downtime and improving system reliability for data engineering teams.</li>
                    <li>Deployed and maintained applications across Google Compute Engine and GKE clusters, supporting high availability and efficient containerized workloads.</li>
                    <li>Automated CI/CD pipelines with Jenkins, accelerating release cycles and improving development workflows across multiple teams.</li>
                    <li>Implemented cost optimization strategies in GCP, contributing to over $10M in annual cloud savings through rightsizing, monitoring, and resource cleanup.</li>
                    <li>Mentored and onboarded 4 early career engineers and interns, accelerating their ramp-up and contributing to team knowledge growth.</li>
                  </ul>
                  <div className="mt-5 pt-4 border-t border-token">
                    <h4 className="text-sm font-semibold">Skills &amp; Tools</h4>
                    <ul className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                      <TagChip as="li">Cloud DevOps &amp; Infrastructure (GCP)</TagChip>
                      <TagChip as="li">Application &amp; Infrastructure Monitoring</TagChip>
                      <TagChip as="li">Cloud Cost Optimization</TagChip>
                      <TagChip as="li">IaC (Terraform)</TagChip>
                      <TagChip as="li">Linux</TagChip>
                      <TagChip as="li">Git / GitLab</TagChip>
                      <TagChip as="li">CI/CD (Jenkins &amp; GitLab)</TagChip>
                      <TagChip as="li">Kubernetes / GKE</TagChip>
                      <TagChip as="li">Python</TagChip>
                      <TagChip as="li">Bash / Shell Scripting</TagChip>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Projects */}
          <section id="projects" className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 scroll-mt-24">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
              <GlowAccents size={GLOW_SIZE.PROJECTS} parallax maxShift={GLOW_MAX_SHIFT} />
            </div>
            <div className="relative z-[1]">
              {/* Projects cards */}
              <h2 className="text-2xl font-bold tracking-tight text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_16px_rgba(253,230,138,0.55)]">Projects</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">CHSN Running Platform</h3>
                    <a
                      href="https://github.com/austinhogan11/chsn-running-platform"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="CHSN Running Platform repository"
                      title="View repository on GitHub"
                      className="group inline-grid place-items-center w-9 h-9 rounded-md text-muted transition-shadow transition-colors border border-zinc-400 dark:border-zinc-500 hover-accent focus-accent"
                    >
                      <IconGitHub className="w-5 h-5 transition-colors" />
                    </a>
                  </div>

                  {/* Compact overview */}
                  <p className="mt-2 text-sm text-muted">
                    Running training platform featuring a training log &amp; a pace calculator. Containerized with Docker and deployed on GCP Cloud Run via Terraform. Alternate deployment using GKE for greater scalability.
                  </p>

                  {/* Tech chips */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                    <TagChip>Python</TagChip>
                    <TagChip>Docker</TagChip>
                    <TagChip>GCP</TagChip>
                    <TagChip>Cloud Run</TagChip>
                    <TagChip>GKE</TagChip>
                    <TagChip>Artifact Registry</TagChip>
                    <TagChip>Terraform</TagChip>
                    <TagChip>GitHub Actions</TagChip>
                  </div>

                  {/* Expandable details */}
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer select-none text-muted transition-colors hover:text-fg/90 focus:outline-none focus-visible:underline focus-visible:decoration-dotted focus-visible:decoration-token">
                      More details
                    </summary>
                    <div className="mt-2 text-muted space-y-3">
                      <div>
                        <p className="font-medium text-fg">Features</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Training log to track and analyze runs.</li>
                          <li>Running pace calculator.</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-fg">Upcoming</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>User accounts with per-user training logs.</li>
                          <li>Calendar view for lifting programs and cardio summaries.</li>
                          <li>Coach/athlete sharing and dashboards.</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </Card>

                <Card className="p-5 will-change-transform">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Personal Site</h3>
                    <a
                      href="https://github.com/austinhogan11/personal-site"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Personal Site repository"
                      title="View repository on GitHub"
                      className="group inline-grid place-items-center w-9 h-9 rounded-md text-muted transition-shadow transition-colors border border-zinc-400 dark:border-zinc-500 hover-accent focus-accent"
                    >
                      <IconGitHub className="w-5 h-5 transition-colors" />
                    </a>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Personal portfolio &amp; resume site that showcases my Cloud DevOps work and projects. Built with React (Vite) and Tailwind, with small design tokens and a clean dark theme.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    <TagChip>React</TagChip>
                    <TagChip>Tailwind</TagChip>
                    <TagChip>Vite</TagChip>
                  </div>
                </Card>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Education */}
          <section id="education" className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 scroll-mt-24">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
              <GlowAccents size={GLOW_SIZE.EDUCATION} parallax maxShift={GLOW_MAX_SHIFT} />
            </div>
            <div className="relative z-[1]">
              {/* Education details */}
              <h2 className="text-2xl font-bold tracking-tight text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_16px_rgba(253,230,138,0.55)]">Education</h2>
              <Card className="mt-6 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Kennesaw State University</h3>
                    <p className="italic text-sm text-muted">Bachelor of Science, Software Engineering</p>
                    <p className="italic text-sm text-muted">Minor: Computer Science</p>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>2017 – 2021</p>
                    <p><span className="italic">GPA: 3.58</span></p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">Courses &amp; Projects</h4>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Programming Principles — Built a 3D Maze & Third‑Person Shooter in Unity (C#) to learn core programming concepts.</li>
                    <li>Data Structures — Learned and implemented core data structures in C++.</li>
                    <li>Software Testing — Practiced Test‑Driven Development (TDD) using Java.</li>
                    <li>Software Project Management — Built a software project management system in Java.</li>
                    <li>
                      Software Engineering Capstone — Text Marks the Spot: geolocation‑based messaging mobile app (iOS/Android), built with Flutter.
                      <a
                        href="https://github.com/austinhogan11/text_marks_the_spot_app"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Text Marks the Spot GitHub repository"
                        className="ml-2 inline-flex items-center align-middle text-muted transition-colors group hover-accent"
                        title="View repository on GitHub"
                      >
                        <IconGitHub className="w-4 h-4 transition-colors" />
                      </a>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Hobbies */}
          <section id="hobbies" className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 scroll-mt-24">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
              <GlowAccents size={GLOW_SIZE.HOBBIES} parallax maxShift={GLOW_MAX_SHIFT} />
            </div>
            <div className="relative z-[1]">
              {/* Hobbies grid */}
              <h2 className="text-2xl font-bold tracking-tight mt-4 mb-4 text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_16px_rgba(253,230,138,0.55)]">Hobbies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Running & Coaching */}
                <Card className="p-5">
                  <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Running &amp; Coaching</h3>
                  <p className="mt-2 text-sm text-muted">
                    I began my running career joining the track team in high school as a hurdler, now I run road races from 1 mile to marathons.
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    I am currently coaching one athlete for his first marathon on my running team, CHSN Running.
                  </p>
                  <p className="mt-3 text-sm text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">
                    Follow my page on{" "}
                    <a
                      href="https://www.instagram.com/chsnrunning/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-transparent hover:decoration-current"
                    >
                      Instagram @chsnrunning
                    </a>.
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">Goals</p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-muted space-y-1">
                      <li>Sub‑5 min Mile</li>
                      <li>Sub‑3 hr Marathon</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.45)]">Personal Bests</p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-muted space-y-1">
                      <li>5K: 18:35</li>
                      <li>Half‑Marathon: 1:28</li>
                      <li>Marathon: 3:13</li>
                    </ul>
                  </div>
                </Card>

                {/* Reading */}
                <Card className="p-5">
                  <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Reading</h3>
                  <p className="mt-2 text-sm text-muted">
                    I love to read — my favorite genres are self‑improvement, science, and sci‑fi/fantasy.
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    I am currently reading <span className="italic">Go One More</span> by Nick Bare. He is the CEO of Bare Performance Nutrition and a hybrid‑athlete.
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    I am also reading my way through the canon Star Wars novels (there are a lot!).
                  </p>
                </Card>

                {/* Learning Spanish */}
                <Card className="p-5">
                  <h3 className="font-semibold text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_14px_rgba(253,230,138,0.5)]">Learning Spanish</h3>
                  <p className="mt-2 text-sm text-muted">
                    I recently surpassed the 1000‑day streak on Duolingo — which I’m proud of. I also learn Spanish from my wife, who is Puerto Rican.
                  </p>
                </Card>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Contact */}
          <section id="contact" className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-12 sm:pb-16 scroll-mt-24">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {/* Ambient background glow for depth; parallax auto‑disables for reduced‑motion users */}
              <GlowAccents size={GLOW_SIZE.CONTACT} parallax maxShift={GLOW_MAX_SHIFT} />
            </div>
            <div className="relative z-[1]">
              {/* Contact call‑to‑action */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold tracking-tight text-blue-900 drop-shadow-[0_0_6px_rgba(30,58,138,0.25)] dark:text-amber-200 dark:drop-shadow-[0_0_16px_rgba(253,230,138,0.55)]">Let’s work together</h2>
                <p className="mt-2 text-sm text-muted">
                  Email me or reach out on LinkedIn. I’m happy to chat about roles, projects, or collaboration.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <a
                    href="mailto:austinhogan15@gmail.com"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium border border-amber-300/30 dark:border-amber-200/30 text-blue-950 dark:text-blue-900 bg-amber-300 dark:bg-amber-200 hover:bg-amber-200 dark:hover:bg-amber-100 shadow-[0_0_18px_rgba(253,230,138,.35)] hover:shadow-[0_0_24px_rgba(253,230,138,.5)] transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/60 dark:focus:ring-amber-200/60"
                  >
                    Email
                  </a>
                  <a
                    href="https://www.linkedin.com/in/austin-hogan-663164151/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium border border-token text-fg bg-transparent hover-accent focus-accent"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/austinhogan11"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium border border-token text-fg bg-transparent hover-accent focus-accent"
                  >
                    GitHub
                  </a>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Austin Hogan. All rights reserved.
      </footer>
    </div>
  );
}
