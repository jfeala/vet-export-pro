export function TrustBar() {
  return (
    <section className="bg-primary-bg border-b border-border-light">
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm text-text-muted">
        <span className="flex items-center gap-2">
          <span className="text-primary font-bold">USDA APHIS</span>
          compliant certificates
        </span>
        <span className="hidden md:inline text-border">|</span>
        <span>EU 2019/1293 regulation</span>
        <span className="hidden md:inline text-border">|</span>
        <span>30+ supported destinations</span>
        <span className="hidden md:inline text-border">|</span>
        <span>Free to use</span>
      </div>
    </section>
  );
}
