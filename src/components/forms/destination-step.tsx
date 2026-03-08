"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Row } from "@/components/ui/row";
import { InfoBanner } from "@/components/ui/info-banner";
import {
  COUNTRIES_EU,
  TAPEWORM_REQUIRED,
} from "@/lib/certificates/en-es-2019-1293/constants";
import type { CertificateFormData } from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function DestinationStep({ data, update }: Props) {
  const dest = COUNTRIES_EU.find((c) => c.code === data.destinationCountry);
  const needsTapeworm =
    data.destinationCountry &&
    TAPEWORM_REQUIRED.includes(data.destinationCountry);

  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Travel Details
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        This populates Boxes I.9, I.14, I.15, and I.16 of the certificate.
      </p>

      <Field
        label="EU Country of Destination"
        required
        hint="This determines tapeworm treatment requirements and which certificate options apply."
      >
        <Select
          value={data.destinationCountry}
          onChange={(v) => update("destinationCountry", v)}
          options={COUNTRIES_EU.map((c) => ({ value: c.code, label: c.name }))}
          placeholder="Select destination country..."
        />
      </Field>

      {needsTapeworm && (
        <InfoBanner type="warning">
          <strong>{dest?.name}</strong> requires Echinococcus (tapeworm)
          treatment for dogs. The treatment must be administered by a USDA
          Accredited Veterinarian between 1&ndash;5 days before arrival.
          You&apos;ll fill in treatment details in a later step.
        </InfoBanner>
      )}

      <Row>
        <Field
          label="Date of Departure from U.S."
          required
          hint="The certificate must be endorsed by APHIS within 10 days of EU arrival."
        >
          <Input
            type="date"
            value={data.departureDate}
            onChange={(v) => update("departureDate", v)}
          />
        </Field>
        <Field
          label="Means of Transport"
          required
          hint="Box I.15 — e.g., 'Aeroplane', 'Ship'"
        >
          <Select
            value={data.transportMeans}
            onChange={(v) => update("transportMeans", v)}
            options={["Aeroplane", "Ship", "Railway wagon", "Road vehicle"]}
          />
        </Field>
      </Row>

      <Row>
        <Field
          label="Place of Loading"
          hint="Box I.13 — Airport/port of departure, e.g., 'JFK Airport, New York'"
        >
          <Input
            value={data.placeOfLoading}
            onChange={(v) => update("placeOfLoading", v)}
            placeholder="JFK Airport, New York"
          />
        </Field>
        <Field
          label="EU Entry Point (BIP)"
          hint="Box I.16 — The Travellers' Point of Entry in the EU where documentary/identity checks occur."
        >
          <Input
            value={data.entryBIP}
            onChange={(v) => update("entryBIP", v)}
            placeholder="e.g., Heathrow Airport, London"
          />
        </Field>
      </Row>

      <Field
        label="Place of Destination"
        hint="Box I.12 — Final destination address (can be same as EU address above)."
      >
        <Input
          value={data.placeOfDestination}
          onChange={(v) => update("placeOfDestination", v)}
          placeholder="Same as EU address, or specify"
        />
      </Field>
    </div>
  );
}
