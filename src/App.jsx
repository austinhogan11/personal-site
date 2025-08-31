// Personal site scaffold using TailwindCSS
// Sections: Hero, Projects, Experience, Education, Hobbies, Contact

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header / Nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight text-slate-900">
            austin hogan
          </a>
          <nav className="hidden sm:flex gap-6 text-sm">
            <a href="#projects" className="hover:text-blue-600">Projects</a>
            <a href="#experience" className="hover:text-blue-600">Experience</a>
            <a href="#education" className="hover:text-blue-600">Education</a>
            <a href="#hobbies" className="hover:text-blue-600">Hobbies</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12 items-start">
          <div className="md:col-span-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Software Engineer &amp; Builder
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              I design, build, and ship web apps end‑to‑end — from data models and APIs to
              mobile‑friendly UIs and cloud deployments.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">React</span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">Python</span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">GCP</span>
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs">Cloud Run</span>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs">Terraform</span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs">GKE</span>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="#projects"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* Quick details card */}
          <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900">At a glance</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h2>
          <a href="#" className="text-sm text-blue-600 hover:underline">View GitHub</a>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Project Card 1 */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900">CHSN Running Platform</h3>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">
                Cloud Run &amp; GKE
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Containerized Python web app deployed to GCP. Infrastructure codified with Terraform; CI/CD via
              GitHub Actions. Deployed to Cloud Run and GKE, images in Artifact Registry.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="rounded bg-slate-100 px-2 py-0.5">Python</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">FastAPI</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">Docker</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">Terraform</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">GCP</li>
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="#" className="text-blue-600 hover:underline">Live URL</a>
              <a href="#" className="text-slate-600 hover:underline">Repository</a>
              <a href="#" className="text-slate-600 hover:underline">Docs</a>
            </div>
          </article>

          {/* Project Card 2 (placeholder) */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900">Personal Site</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
                This site
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Vite + React site styled with Tailwind CSS. Deployed via static hosting or container — easy to extend
              with blog, notes, and project write‑ups.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="rounded bg-slate-100 px-2 py-0.5">React</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">Tailwind</li>
              <li className="rounded bg-slate-100 px-2 py-0.5">Vite</li>
            </ul>
            <div className="mt-4 flex gap-3 text-sm">
              <a href="#" className="text-blue-600 hover:underline">Live URL</a>
              <a href="#" className="text-slate-600 hover:underline">Repository</a>
            </div>
          </article>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Experience</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Role @ Company</h3>
              <span className="text-xs text-slate-500">2023 — Present</span>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>Built services with Python/Node; implemented CI/CD with GitHub Actions.</li>
              <li>Production deployments on GCP (Cloud Run, GKE) with Terraform.</li>
              <li>Improved performance and reliability across the stack.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Education</h2>
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-700">
            Your Degree — Your University • YYYY
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Relevant coursework: Algorithms, Distributed Systems, Databases, Cloud Computing
          </p>
        </div>
      </section>

      {/* Hobbies */}
      <section id="hobbies" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Hobbies</h2>
        <p className="mt-3 text-sm text-slate-600">
          Running, strength training, cooking, reading — and building small tools that make life easier.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Let’s work together</h2>
          <p className="mt-2 text-sm text-slate-600">
            Email me or reach out on LinkedIn. I’m happy to chat about roles, projects, or collaboration.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href="mailto:you@example.com" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
              Email
            </a>
            <a href="#" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100">
              LinkedIn
            </a>
            <a href="#" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Austin Hogan. All rights reserved.
      </footer>
    </div>
  );
}
