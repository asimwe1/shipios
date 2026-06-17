import Link from "next/link";

const links = [
  { href: "#generator", label: "Generate" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-semibold text-[#f6efe7] shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
          AL
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[-0.03em]">AppLaunchKit</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--ink-soft)]">
            Launch assets for app founders
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <nav className="hidden items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.76)] p-1 shadow-[0_14px_30px_rgba(15,23,42,0.05)] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-[var(--ink-soft)] transition-colors hover:bg-white hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="#generator"
          className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-[#fff7ef] transition-colors hover:bg-[#121722]"
        >
          Start
        </Link>
      </div>
    </header>
  );
}
