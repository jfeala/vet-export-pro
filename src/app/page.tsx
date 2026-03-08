import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f7f5] font-sans">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">&#x1F43E;</span>
            <h1 className="text-4xl font-serif font-bold tracking-tight">
              VetExport Pro
            </h1>
          </div>
          <p className="text-xl opacity-90 mb-2 max-w-2xl">
            Simplify USDA APHIS international health certificates for pet travel.
          </p>
          <p className="text-base opacity-70 mb-8 max-w-2xl">
            A guided, step-by-step web form that collects your information,
            applies regulatory logic, and generates a correctly completed
            certificate ready for vet signature and APHIS endorsement.
          </p>
          <Link
            href="/certificate"
            className="inline-block px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors no-underline shadow-lg"
          >
            Start EU Pet Travel Certificate &rarr;
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-serif font-bold text-text mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border-light shadow-sm">
            <div className="text-3xl mb-3">1</div>
            <h3 className="font-semibold text-text mb-2">Answer Questions</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Walk through a guided wizard covering owner info, travel details,
              pet identification, vaccination records, and veterinarian details.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border-light shadow-sm">
            <div className="text-3xl mb-3">2</div>
            <h3 className="font-semibold text-text mb-2">
              Automatic Validation
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              The app checks date consistency, microchip number matching,
              tapeworm treatment windows, and all regulatory requirements before
              generating.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-border-light shadow-sm">
            <div className="text-3xl mb-3">3</div>
            <h3 className="font-semibold text-text mb-2">Get Your PDF</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Download a correctly completed EN-ES 2019-1293 certificate ready
              for your vet&apos;s signature and APHIS endorsement.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Certificate */}
      <div className="max-w-4xl mx-auto px-8 pb-16">
        <div className="bg-white rounded-xl p-6 border border-border-light shadow-sm">
          <h3 className="font-semibold text-text mb-2">
            Currently Supported Certificate
          </h3>
          <div className="flex items-start gap-4">
            <div className="bg-primary-bg text-primary px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap">
              EN-ES 2019-1293
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              EU non-commercial movement of dogs, cats, and ferrets from the
              United States. This bilingual English/Spanish certificate is
              required for pet travel to all EU member states, plus the UK,
              Norway, and Northern Ireland.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border-light bg-white px-8 py-6">
        <div className="max-w-4xl mx-auto text-sm text-text-muted">
          VetExport Pro is not affiliated with USDA APHIS. Always verify
          certificate requirements with your local APHIS Veterinary Services
          office before travel.
        </div>
      </div>
    </div>
  );
}
