const steps = [
  {
    num: "01",
    title: "Answer Simple Questions",
    desc: "Walk through a guided wizard covering owner info, travel details, pet identification, vaccination records, and vet details. Plain language — no regulatory jargon.",
  },
  {
    num: "02",
    title: "We Handle the Rules",
    desc: "The app checks date consistency, microchip numbers, tapeworm treatment windows, and all regulatory requirements. Country-specific rules are built in.",
  },
  {
    num: "03",
    title: "Download Your PDF",
    desc: "Get a correctly completed EN-ES 2019-1293 certificate with all strikethroughs applied, ready for your vet's signature and APHIS endorsement.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-text mb-4 text-center">
          How It Works
        </h2>
        <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
          Three steps. No guesswork. No rejected certificates at the border.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-2xl p-7 border border-border-light shadow-sm"
            >
              <div className="text-4xl font-serif font-bold text-primary/20 mb-3">
                {s.num}
              </div>
              <h3 className="font-semibold text-text text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
