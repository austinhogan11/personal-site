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
  }, [theme]);

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-toggle border-token text-fg hover:bg-card/60"
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

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Header / Nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-card/70 border-b border-token">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">
            austin hogan
          </a>
          <nav className="hidden sm:flex gap-6 text-sm items-center">
            <a href="#projects" className="link">Projects</a>
            <a href="#experience" className="link">Experience</a>
            <a href="#education" className="link">Education</a>
            <a href="#hobbies" className="link">Hobbies</a>
            <a href="#contact" className="link">Contact</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12 items-start">
          <div className="md:col-span-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Software Engineer &amp; Builder
            </h1>
            <p className="mt-4 text-lg text-muted">
              I design, build, and ship web apps end‑to‑end — from data models and APIs to
              mobile‑friendly UIs and cloud deployments.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full badge-primary text-xs">React</span>
              <span className="px-3 py-1 rounded-full badge-primary text-xs">Python</span>
              <span className="px-3 py-1 rounded-full badge-primary text-xs">GCP</span>
              <span className="px-3 py-1 rounded-full badge-primary text-xs">Cloud Run</span>
              <span className="px-3 py-1 rounded-full badge-accent text-xs">Terraform</span>
              <span className="px-3 py-1 rounded-full badge-primary text-xs">GKE</span>
            </div>

            <div className="mt-8 flex gap-3">
              <a href="#projects" className="btn-primary ring-token">View Projects</a>
              <a href="#contact" className="btn-ghost">Get in touch</a>
            </div>
          </div>

          {/* Quick details card */}
          <aside className="card p-4">
            <h2 className="font-semibold">At a glance</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>📍 Based in (City, ST)</li>
              <li>💼 Open to full‑time or contract</li>
              <li>☁️ Cloud: GCP (Cloud Run, GKE, Artifact Registry)</li>
              <li>🧰 IaC: Terraform</li>
              <li>🧪 CI/CD: GitHub Actions</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <a href="#" className="text-sm link">View GitHub</a>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Project Card 1 */}
          <article className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">CHSN Running Platform</h3>
              <span className="rounded-full px-2.5 py-0.5 text-xs" style={{backgroundColor: "color-mix(in oklab, var(--primary) 18%, white)", color: "var(--primary)"}}>
                Cloud Run &amp; GKE
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Containerized Python web app deployed to GCP. Infrastructure codified with Terraform; CI/CD via
              GitHub Actions. Deployed to Cloud Run and GKE, images in Artifact Registry.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
              <li className="rounded bg-card border border-token px-2 py-0.5">Python</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">FastAPI</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">Docker</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">Terraform</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">GCP</li>
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="#" className="link">Live URL</a>
              <a href="#" className="hover:underline">Repository</a>
              <a href="#" className="hover:underline">Docs</a>
            </div>
          </article>

          {/* Project Card 2 */}
          <article className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Personal Site</h3>
              <span className="rounded-full px-2.5 py-0.5 text-xs" style={{backgroundColor: "color-mix(in oklab, var(--accent) 18%, white)", color: "var(--accent)"}}>
                This site
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Vite + React site styled with Tailwind CSS. Deployed via static hosting or container — easy to extend
              with blog, notes, and project write‑ups.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
              <li className="rounded bg-card border border-token px-2 py-0.5">React</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">Tailwind</li>
              <li className="rounded bg-card border border-token px-2 py-0.5">Vite</li>
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="#" className="link">Live URL</a>
              <a href="#" className="hover:underline">Repository</a>
            </div>
          </article>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <div className="mt-6 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Role @ Company</h3>
              <span className="text-xs text-muted">2023 — Present</span>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted space-y-1">
              <li>Built services with Python/Node; implemented CI/CD with GitHub Actions.</li>
              <li>Production deployments on GCP (Cloud Run, GKE) with Terraform.</li>
              <li>Improved performance and reliability across the stack.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        <div className="mt-6 card p-5">
          <p className="text-sm">
            Your Degree — Your University • YYYY
          </p>
          <p className="mt-1 text-sm text-muted">
            Relevant coursework: Algorithms, Distributed Systems, Databases, Cloud Computing
          </p>
        </div>
      </section>

      {/* Hobbies */}
      <section id="hobbies" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight">Hobbies</h2>
        <p className="mt-3 text-sm text-muted">
          Running, strength training, cooking, reading — and building small tools that make life easier.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="card p-6">
          <h2 className="text-2xl font-bold tracking-tight">Let’s work together</h2>
          <p className="mt-2 text-sm text-muted">
            Email me or reach out on LinkedIn. I’m happy to chat about roles, projects, or collaboration.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href="mailto:you@example.com" className="btn-primary ring-token">
              Email
            </a>
            <a href="#" className="btn-ghost">
              LinkedIn
            </a>
            <a href="#" className="btn-ghost">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Austin Hogan. All rights reserved.
      </footer>
    </div>
  );
}
