const benefits = [
  {
    title: "Less Time Per Certificate",
    desc: "Collect information once through a standard form, and the certificate populates itself. No more cross-referencing the 8-page APHIS instruction sheet — what used to take an hour takes minutes.",
  },
  {
    title: "Less Confusion, Fewer Rejections",
    desc: "No more guessing which boxes to check or which sections to strike. Built-in validation catches date errors, missing microchip fields, and wrong strikethrough patterns before you print.",
  },
  {
    title: "Destination-Specific Rules Built In",
    desc: "Each export certificate has its own requirements — treatment timelines, declarations, strikethrough patterns. The form adapts automatically so you don't have to memorize regulations for every destination.",
  },
  {
    title: "Less Stress, More Confidence",
    desc: "Sign certificates knowing the correct strikethroughs and declarations have been applied. No more second-guessing yourself or worrying about endorsement rejections.",
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
          Export health certificates shouldn&apos;t be the worst part of your day.
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
