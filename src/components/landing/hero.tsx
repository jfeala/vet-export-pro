import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-4">
          EU Pet Travel Made Simple
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 max-w-3xl leading-tight">
          Stop guessing. Get your pet&apos;s health certificate right the first
          time.
        </h1>
        <p className="text-lg md:text-xl opacity-85 mb-10 max-w-2xl leading-relaxed">
          VetExport Pro walks you through every field on the USDA APHIS
          certificate, applies the regulatory logic automatically, and generates
          a print-ready PDF for your vet to sign.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/certificate"
            className="inline-block px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors no-underline shadow-lg"
          >
            Get Started Free &rarr;
          </Link>
          <a
            href="#how-it-works"
            className="inline-block px-8 py-4 border-2 border-white/40 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-colors no-underline"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
