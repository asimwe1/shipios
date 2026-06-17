import { GenerateForm } from "@/components/app-launch-kit/generate-form";

export default function GeneratePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12">
      <section className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--ink-soft)]">
          Generate kit
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Paste the app idea. Generate the launch kit.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
          This MVP stays intentionally narrow: idea in, launch story out. No code generation, no fake complexity.
        </p>
      </section>

      <GenerateForm />
    </main>
  );
}

