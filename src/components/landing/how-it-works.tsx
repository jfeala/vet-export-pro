const steps = [
  {
    num: "01",
    title: "Enter Client & Patient Details",
    desc: "You will fill out a simple, standardized form with owner info, travel details, and pet information. This information will be saved for frequent travelers to streamline the process in the future.",
  },
  {
    num: "02",
    title: "Certificate Populates Automatically",
    desc: "VetExport Pro selects the right APHIS export certificate and fills it in for you.",
  },
  {
    num: "03",
    title: "Review, Sign & Submit",
    desc: "Open the completed export certificate, verify the details, sign, and send to APHIS for endorsement.",
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
          Three steps. No guesswork. No rejected endorsements.
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
