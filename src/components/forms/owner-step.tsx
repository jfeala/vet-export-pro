"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Row } from "@/components/ui/row";
import type { CertificateFormData } from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function OwnerStep({ data, update }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Owner / Consignor Information
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        This maps to Boxes I.1 and I.5 of the health certificate. Enter details
        for the person responsible for the pet during travel.
      </p>

      <Field
        label="Who is traveling with the pet?"
        required
        hint="This determines the 'responsibility' clause in Section II.1 of the certificate."
      >
        <Select
          value={data.travelingPerson}
          onChange={(v) => update("travelingPerson", v)}
          options={[
            { value: "owner", label: "The owner" },
            {
              value: "authorized",
              label: "An authorized person (with written permission from owner)",
            },
            {
              value: "carrier",
              label: "A carrier/pet travel agent contracted by owner",
            },
          ]}
        />
      </Field>

      {data.travelingPerson === "carrier" && (
        <Field label="Carrier / Pet Travel Agent Name" required>
          <Input
            value={data.carrierName}
            onChange={(v) => update("carrierName", v)}
            placeholder="e.g., PetRelocation LLC"
          />
        </Field>
      )}

      <h4 className="text-sm text-primary font-semibold mt-7 mb-3 uppercase tracking-widest">
        U.S. Contact Info (Box I.1 — Consignor)
      </h4>
      <Row>
        <Field label="Full Name" required>
          <Input
            value={data.ownerNameUS}
            onChange={(v) => update("ownerNameUS", v)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Phone Number" required>
          <Input
            value={data.ownerPhoneUS}
            onChange={(v) => update("ownerPhoneUS", v)}
            placeholder="+1 555-123-4567"
          />
        </Field>
      </Row>
      <Field label="U.S. Street Address" required>
        <Input
          value={data.ownerAddressUS}
          onChange={(v) => update("ownerAddressUS", v)}
          placeholder="123 Main St, Springfield, IL 62704"
        />
      </Field>

      <h4 className="text-sm text-primary font-semibold mt-7 mb-3 uppercase tracking-widest">
        EU Contact Info (Box I.5 — Consignee)
      </h4>
      <Row>
        <Field label="Full Name at Destination" required>
          <Input
            value={data.ownerNameEU}
            onChange={(v) => update("ownerNameEU", v)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Phone Number at Destination">
          <Input
            value={data.ownerPhoneEU}
            onChange={(v) => update("ownerPhoneEU", v)}
            placeholder="+44 20 7946 0958"
          />
        </Field>
      </Row>
      <Field
        label="EU Street Address"
        required
        hint="Include city, postal code, and country name."
      >
        <Input
          value={data.ownerAddressEU}
          onChange={(v) => update("ownerAddressEU", v)}
          placeholder="10 Downing Street, London SW1A 2AA, England"
        />
      </Field>
      <Field label="EU Postal Code" required>
        <Input
          value={data.ownerPostalCodeEU}
          onChange={(v) => update("ownerPostalCodeEU", v)}
          placeholder="SW1A 2AA"
        />
      </Field>
    </div>
  );
}
