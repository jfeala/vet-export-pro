"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is EN-ES 2019-1293?",
    a: "It's the official USDA APHIS health certificate required for non-commercial movement of dogs, cats, and ferrets from the United States to EU member states, the UK, and Norway. It's a bilingual English/Spanish form.",
  },
  {
    q: "Do I still need to visit a USDA-accredited veterinarian?",
    a: "Yes. VetExport Pro fills out the certificate for you, but a USDA-accredited veterinarian must examine your pet, verify the information, and sign the certificate. The signed certificate then needs APHIS endorsement.",
  },
  {
    q: "What is APHIS endorsement?",
    a: "After your vet signs the certificate, it must be endorsed (counter-signed) by a USDA APHIS Veterinary Services office. This must happen within 10 days of your pet's arrival in the EU. VetExport Pro generates a certificate that's ready for this step.",
  },
  {
    q: "Does my pet need a microchip?",
    a: "Yes. All dogs, cats, and ferrets traveling to the EU must have an ISO 11784/11785 compliant microchip (15-digit). The microchip must be implanted before the rabies vaccination.",
  },
  {
    q: "Is VetExport Pro free?",
    a: "Yes, it's currently free to use. We may introduce paid features in the future for additional certificate types and premium support.",
  },
  {
    q: "What about tapeworm treatment?",
    a: "Tapeworm (Echinococcus) treatment is only required for dogs traveling to the UK, Ireland, Finland, Malta, and Norway. It must be administered by a veterinarian 1–5 days before arrival. The form handles this automatically based on your destination.",
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
