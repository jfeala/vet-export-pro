import Link from "next/link";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">&#x1F43E;</span>
          <span className="text-lg font-serif font-bold text-text tracking-tight">
            VetExport Pro
          </span>
        </Link>
        <Link
          href="/certificate"
          className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
        >
          Start Certificate
        </Link>
      </div>
    </nav>
  );
}
