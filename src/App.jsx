import { useEffect, useState } from "react";
// Personal site scaffold using TailwindCSS
// Light/Dark theming via CSS variables defined in index.css

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    document.dispatchEvent(new Event('themechange'));
  }, [theme]);

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      onClick={(e) => { setTheme(theme === "dark" ? "light" : "dark"); e.currentTarget.blur(); }}
      className="theme-toggle text-fg hover:bg-card/60 border border-zinc-400 dark:border-zinc-500 hover:border-blue-900 dark:hover:border-yellow-300 active:border-blue-900 dark:active:border-yellow-300 focus:outline-none focus:ring-0 focus:shadow-none transition-shadow hover:shadow-[0_0_10px_rgba(30,58,138,0.6)] dark:hover:shadow-[0_0_10px_rgba(250,204,21,0.6)]"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m8.66-11.66l-.7.7M4.34 17.66l-.7.7M21 12h-1M4 12H3m15.66 5.66l-.7-.7M6.34 6.34l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

function ScrollSpyNav() {
  const sections = [
    { id: "top", label: "Overview" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "hobbies", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ];
  const [active, setActive] = useState("top");

  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    // Observe class changes on <html>
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('themechange', update);
    return () => { mo.disconnect(); document.removeEventListener('themechange', update); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Section navigation" className="relative hidden lg:flex lg:flex-col gap-8 text-sm select-none">
      {/* vertical rail */}
      <div className="absolute top-0 bottom-0 left-[7px] w-px bg-token/40" aria-hidden />
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group relative pl-6 flex items-center"
        >
          {/* dot */}
          <span
            className={`absolute left-0 h-3.5 w-3.5 rounded-full transition-all ${
              active === s.id
                ? 'bg-bg border-2 scale-125 border-blue-900 shadow-[0_0_12px_rgba(30,58,138,0.45)] dark:border-amber-200 dark:shadow-[0_0_12px_rgba(253,230,138,0.6)]'
                : 'bg-bg border border-token'
            }`}
            aria-hidden
          />
          {/* label (fades in on hover) */}
          <span
            className={`ml-2 px-0.5 transition-colors ${
              active === s.id
                ? 'text-fg font-semibold'
                : 'text-muted opacity-60'
            } group-hover:opacity-100`}
          >
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `html{scroll-behavior:smooth}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [duoStreak, setDuoStreak] = useState(1002);
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="fixed top-3 right-3 z-20 flex flex-col items-end gap-2">
        <ThemeToggle />
        <a
          href="https://github.com/austinhogan11"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub Profile"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle inline-grid place-items-center w-9 h-9 text-muted hover:text-fg border border-zinc-400 dark:border-zinc-500 hover:border-blue-900 dark:hover:border-yellow-300 active:border-blue-900 dark:active:border-yellow-300 focus:outline-none focus:ring-0 focus:shadow-none transition-shadow hover:shadow-[0_0_10px_rgba(30,58,138,0.6)] dark:hover:shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.7.3-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.4 5.9.4.3.7.9.7 1.9v2.9c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/austin-hogan-663164151/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn Profile"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle inline-grid place-items-center w-9 h-9 text-muted hover:text-fg border border-zinc-400 dark:border-zinc-500 hover:border-blue-900 dark:hover:border-yellow-300 active:border-blue-900 dark:active:border-yellow-300 focus:outline-none focus:ring-0 focus:shadow-none transition-shadow hover:shadow-[0_0_10px_rgba(30,58,138,0.6)] dark:hover:shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.08V23h-4v-5.71c0-1.36-.02-3.11-1.9-3.11-1.9 0-2.19 1.49-2.19 3.02V23h-4V8.5z" />
          </svg>
        </a>
        <a
          href="mailto:austinhogan15@gmail.com"
          aria-label="Email Austin Hogan"
          onClick={(e) => e.currentTarget.blur()}
          className="theme-toggle inline-grid place-items-center w-9 h-9 text-muted hover:text-fg border border-zinc-400 dark:border-zinc-500 hover:border-blue-900 dark:hover:border-yellow-300 active:border-blue-900 dark:active:border-yellow-300 focus:outline-none focus:ring-0 focus:shadow-none transition-shadow hover:shadow-[0_0_10px_rgba(30,58,138,0.6)] dark:hover:shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 13 20 6.01V6H4zm0 12h16V8l-8 7-8-7v10z" />
          </svg>
        </a>
      </div>
      <div className="grid lg:grid-cols-[auto_1fr]">
        <aside className="sticky top-0 h-[100svh] hidden lg:flex items-center justify-start pl-6">
          <ScrollSpyNav />
        </aside>
        <main className="pb-16 mx-auto max-w-[1100px] px-4">
          {/* Hero */}
          <section id="top" className="mx-auto max-w-6xl px-4 py-16 sm:py-24 scroll-mt-24">
            <div className="grid gap-10 md:grid-cols-3 md:gap-12 items-start">
              <div className="md:col-span-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  <span className="block text-fg">Austin Hogan</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-sky-500">Software Engineer &amp; Builder</span>
                </h1>
                <p className="mt-4 text-lg text-muted">
                  I design, build, and ship web apps end‑to‑end — from data models and APIs to
                  mobile‑friendly UIs and cloud deployments.
                </p>


                <div className="mt-8 flex gap-3">
                  <a href="#projects" className="btn-primary ring-token">View Projects</a>
                  <a href="#contact" className="btn-ghost">Get in touch</a>
                </div>
              </div>

              {/* Quick details card */}
              <aside className="card p-4">
                <h2 className="font-semibold">At a glance</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>- Location: Atlanta, GA</li>
                  <li>- Email: <a href="mailto:austinhogan15@gmail.com" className="hover:underline">austinhogan15@gmail.com</a></li>
                  <li>- Studying: <a href="https://roadmap.sh/devops" target="_blank" rel="noreferrer" className="hover:underline">DevOps on Roadmap.sh</a></li>
                  <li>- Reading: <span className="italic">Go One More</span> by Nick Bare</li>
                  <li>- Duolingo Spanish Streak: <span className="font-semibold">{duoStreak}</span> days</li>
                </ul>
              </aside>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Experience */}
          <section id="experience" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            <div className="mt-6 space-y-4">
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Software Engineer (Cloud DevOps / Platform)</h3>
                    <p className="text-sm text-muted">Macy’s Inc.</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-muted">June 2021 – Present</span>
                    <span className="block text-xs text-muted">Atlanta, GA</span>
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
                  <h4 className="text-sm font-semibold">Skills &amp; Tools (role-relevant)</h4>
                  <ul className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                    <li className="rounded bg-card border border-token px-2 py-0.5">Cloud DevOps &amp; Infrastructure (GCP)</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Application &amp; Infrastructure Monitoring</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Cloud Cost Optimization</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">IaC (Terraform)</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Linux</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Git / GitLab</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">CI/CD (Jenkins &amp; GitLab)</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Kubernetes / GKE</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Python</li>
                    <li className="rounded bg-card border border-token px-2 py-0.5">Bash / Shell Scripting</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Projects */}
          <section id="projects" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="card p-5">
                <h3 className="font-semibold">CHSN Running Platform</h3>
                <p className="mt-2 text-sm text-muted">
                  Containerized Python web app deployed to GCP. Infrastructure codified with Terraform; CI/CD via GitHub Actions. Deployed to Cloud Run and GKE, images in Artifact Registry.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded bg-card border border-token px-2 py-0.5">Python</span>
                  <span className="rounded bg-card border border-token px-2 py-0.5">GCP</span>
                  <span className="rounded bg-card border border-token px-2 py-0.5">Terraform</span>
                  <span className="rounded bg-card border border-token px-2 py-0.5">CI/CD</span>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold">Personal Site</h3>
                <p className="mt-2 text-sm text-muted">
                  Vite + React site styled with Tailwind CSS. Deployed via static hosting or container — easy to extend with blog, notes, and project write-ups.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded bg-card border border-token px-2 py-0.5">React</span>
                  <span className="rounded bg-card border border-token px-2 py-0.5">Tailwind</span>
                  <span className="rounded bg-card border border-token px-2 py-0.5">Vite</span>
                </div>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Education */}
          <section id="education" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight">Education</h2>
            <div className="mt-6 card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Kennesaw State University</h3>
                  <p className="italic text-sm text-muted">Bachelor of Science, Software Engineering</p>
                  <p className="italic text-sm text-muted">Minor: Computer Science</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>2017 – 2021</p>
                  <p><span className="italic">GPA: 3.58</span></p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-sm">Courses &amp; Projects</h4>
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
                      className="ml-2 inline-flex items-center align-middle text-muted transition-colors hover:text-blue-900 dark:hover:text-amber-200"
                      title="View repository on GitHub"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.7.3-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.4 5.9.4.3.7.9.7 1.9v2.9c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.65 18.35.5 12 .5z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[1100px]" />

          {/* Hobbies */}
          <section id="hobbies" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight">Hobbies</h2>
            <p className="mt-3 text-sm text-muted">
              Running, strength training, cooking, reading — and building small tools that make life easier.
            </p>
          </section>
          <hr className="border-t border-token/40 mx-auto max-w-[960px]" />

          {/* Contact */}
          <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 scroll-mt-24">
            <div className="card p-6">
              <h2 className="text-2xl font-bold tracking-tight">Let’s work together</h2>
              <p className="mt-2 text-sm text-muted">
                Email me or reach out on LinkedIn. I’m happy to chat about roles, projects, or collaboration.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href="mailto:austinhogan15@gmail.com" className="btn-primary ring-token">
                  Email
                </a>
                <a href="https://www.linkedin.com/in/austin-hogan-663164151/" target="_blank" rel="noreferrer" className="btn-ghost">
                  LinkedIn
                </a>
                <a href="https://github.com/austinhogan11" target="_blank" rel="noreferrer" className="btn-ghost">
                  GitHub
                </a>
              </div>
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
