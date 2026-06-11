export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-8 shadow-[0_30px_80px_rgba(23,32,51,0.08)] backdrop-blur sm:px-8 sm:py-10">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[rgba(245,158,11,0.16)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[rgba(15,118,110,0.12)] blur-3xl" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
              ShipiOS workspace
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Previewable SwiftUI starter apps, built from a strict schema.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              This repository is prepared for a web-first ShipiOS product:
              prompt in, schema out, browser preview, readiness checks, then a
              deterministic Rust export path.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
                href="https://github.com/asimwe1/shipios"
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white"
                href="https://github.com/asimwe1/shipios/blob/main/README.md"
                target="_blank"
                rel="noreferrer"
              >
                Workspace notes
              </a>
            </div>
          </div>

          <div className="grid gap-3 lg:w-[22rem]">
            {[
              "Next.js web app scaffolded",
              "Rust schema and engine workspace ready",
              "Monorepo docs and agent guidance added",
              "Preview and export contract defined in JSON schema",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-4"
              >
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
                  status
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-6 shadow-[0_20px_50px_rgba(23,32,51,0.05)]">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
            Architecture
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Product layer", "Next.js, dashboard, auth, prompt UX, browser preview shell"],
              ["Contract layer", "ShipiOS schema in Rust, JSON schema artifacts, TS mirror package"],
              ["Engine layer", "Rust validation, scoring, SwiftUI generation, ZIP assembly"],
              ["Worker layer", "Background orchestration, artifact upload, job status updates"],
            ].map(([title, body]) => (
              <article
                key={title}
                className="rounded-3xl border border-[var(--border-soft)] bg-white/80 p-5"
              >
                <h2 className="text-lg font-semibold tracking-[-0.03em]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--foreground)] p-6 text-[#f7f3ec] shadow-[0_20px_50px_rgba(23,32,51,0.12)]">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#b7c1d3]">
            Immediate next steps
          </p>
          <ol className="mt-5 space-y-4 text-sm leading-7 text-[#dde4ef]">
            <li>Install workspace dependencies cleanly with npm at the repo root.</li>
            <li>Replace this placeholder route with the first real landing page.</li>
            <li>Generate TypeScript schema types from the shared contract.</li>
            <li>Build the first habit-tracker preview from the example schema.</li>
            <li>Extend the Rust engine from validation into SwiftUI export.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
