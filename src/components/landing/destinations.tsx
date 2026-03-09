import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

export function Destinations() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-text mb-4 text-center">
          Supported Destinations
        </h2>
        <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
          Starting with EU member states, the UK, and Norway under the EN-ES
          2019-1293 certificate. More destinations and certificate types coming
          soon.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {COUNTRIES_EU.map((c) => (
            <span
              key={c.code}
              className="px-3 py-1.5 bg-white border border-border-light rounded-lg text-sm text-text-muted"
            >
              {c.name}
            </span>
          ))}
        </div>
        <p className="text-xs text-text-muted text-center mt-6">
          More destinations and certificate types coming soon. Sign up below to be notified.
        </p>
      </div>
    </section>
  );
}
