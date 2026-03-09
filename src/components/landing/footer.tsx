import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">&#x1F43E;</span>
              <span className="font-serif font-bold text-text">
                VetExport Pro
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-xs">
              Simplifying USDA APHIS export certificates for veterinarians.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Product
              </h4>
              <div className="space-y-1.5">
                <Link
                  href="/certificate"
                  className="block text-sm text-text-muted hover:text-primary no-underline"
                >
                  Start Certificate
                </Link>
                <a
                  href="#how-it-works"
                  className="block text-sm text-text-muted hover:text-primary no-underline"
                >
                  How It Works
                </a>
                <a
                  href="#signup"
                  className="block text-sm text-text-muted hover:text-primary no-underline"
                >
                  Sign Up
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Contact
              </h4>
              <div className="space-y-1.5">
                <a
                  href="mailto:jake@vetexportpro.com"
                  className="block text-sm text-text-muted hover:text-primary no-underline"
                >
                  jake@vetexportpro.com
                </a>
                <a
                  href="mailto:lauren@vetexportpro.com"
                  className="block text-sm text-text-muted hover:text-primary no-underline"
                >
                  lauren@vetexportpro.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border-light pt-6 text-xs text-text-muted">
          VetExport Pro is not affiliated with USDA APHIS. Always verify
          certificate requirements with your local APHIS Veterinary Services
          office before travel.
        </div>
      </div>
    </footer>
  );
}
