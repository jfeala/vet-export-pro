const benefits = [
  {
    title: "Save Hours of Work",
    desc: "No more cross-referencing the 8-page APHIS instruction sheet. The wizard knows which fields to fill and which sections to strike through.",
  },
  {
    title: "Avoid APHIS Rejection",
    desc: "Incorrect certificates get rejected at endorsement. Our validation catches date errors, missing microchip fields, and wrong strikethrough patterns before you print.",
  },
  {
    title: "Country-Specific Rules",
    desc: "Tapeworm treatment for UK and Finland? Declaration #2 for young pets? The form adapts automatically based on your destination and pet details.",
  },
  {
    title: "Ready for Vet Signature",
    desc: "Your vet receives a perfectly completed certificate — they just review, sign, and send to APHIS for endorsement. No corrections needed.",
  },
];

export function Benefits() {
  return (
    <section className="py-20 bg-primary-bg/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-text mb-4 text-center">
          Why Use VetExport Pro?
        </h2>
        <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
          International pet travel paperwork is notoriously error-prone. We fix
          that.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-7 border border-border-light shadow-sm"
            >
              <h3 className="font-semibold text-text text-lg mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
