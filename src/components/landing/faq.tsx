"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Which certificates does VetExport Pro support?",
    a: "We're starting with EN-ES 2019-1293, the USDA APHIS certificate for non-commercial movement of dogs, cats, and ferrets to the EU, UK, and Norway. We're actively adding support for more export certificate types and destinations.",
  },
  {
    q: "Who is VetExport Pro for?",
    a: "VetExport Pro is built for USDA-accredited veterinarians who issue international health certificates. It collects patient and client travel information with simple input from you, then automatically populates the official certificate — so you just review and sign.",
  },
  {
    q: "How does it handle destination-specific requirements?",
    a: "Different destinations have different rules — tapeworm treatment for UK and Finland, special declarations for young animals, varying vaccination timelines. VetExport Pro knows these rules and applies them automatically based on the destination you select.",
  },
  {
    q: "Does it handle the strikethroughs correctly?",
    a: "Yes. One of the most error-prone parts of the EN-ES form is knowing which sections to strike through based on species, destination, and treatment history. VetExport Pro applies all strikethroughs automatically — no more guessing.",
  },
  {
    q: "How much does VetExport Pro cost?",
    a: "We offer affordable plans designed for veterinary practices. Sign up to learn more about pricing and get early access.",
  },
  {
    q: "What about tapeworm treatment documentation?",
    a: "Tapeworm (Echinococcus) treatment is only required for dogs traveling to the UK, Ireland, Finland, Malta, and Norway. It must be administered 1–5 days before arrival. The form prompts you for treatment details only when required by the destination.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-primary-bg/50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-text mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border-light overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between cursor-pointer bg-transparent border-none"
              >
                <span className="font-semibold text-text text-sm">
                  {f.q}
                </span>
                <span className="text-text-muted text-lg ml-4 shrink-0">
                  {open === i ? "\u2212" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-text-muted leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
