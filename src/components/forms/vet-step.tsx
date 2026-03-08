"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Row } from "@/components/ui/row";
import { InfoBanner } from "@/components/ui/info-banner";
import type { CertificateFormData } from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function VetStep({ data, update }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Signing Veterinarian
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        The vet who signs the certificate. This populates the signature block at
        the end of the health certificate.
      </p>

      <Field
        label="Veterinarian Type"
        required
        hint="This determines which title gets struck through on the certificate."
      >
        <Select
          value={data.vetType}
          onChange={(v) => update("vetType", v)}
          options={[
            { value: "accredited", label: "USDA Accredited Veterinarian" },
            { value: "military", label: "Military Veterinarian" },
          ]}
        />
      </Field>

      {data.vetType === "accredited" && (
        <InfoBanner type="info">
          &ldquo;Official veterinarian&rdquo; will be struck through. APHIS
          endorsement (counter-signature and stamp) is{" "}
          <strong>required</strong>. The vet can sign up to 30 days before
          export, but APHIS must endorse within 10 days of EU arrival.
        </InfoBanner>
      )}
      {data.vetType === "military" && (
        <InfoBanner type="info">
          &ldquo;Authorised veterinarian&rdquo; will be struck through. APHIS
          endorsement is <strong>not required</strong> for Military
          Veterinarians. Stamp is required.
        </InfoBanner>
      )}

      <Row>
        <Field
          label="Veterinarian Full Name"
          required
          hint="Will appear in CAPITALS on the certificate."
        >
          <Input
            value={data.vetName}
            onChange={(v) => update("vetName", v)}
            placeholder="DR. JANE DOE"
          />
        </Field>
        <Field label="Qualification / Title" required>
          <Input
            value={data.vetTitle}
            onChange={(v) => update("vetTitle", v)}
            placeholder={
              data.vetType === "military"
                ? "e.g., CPT, Veterinary Corps"
                : "e.g., DVM, USDA Accredited"
            }
          />
        </Field>
      </Row>
      <Field label="Veterinarian Address" required>
        <Input
          value={data.vetAddress}
          onChange={(v) => update("vetAddress", v)}
          placeholder="456 Vet Clinic Rd, Springfield, IL 62704"
        />
      </Field>
      <Field label="Veterinarian Phone" required>
        <Input
          value={data.vetPhone}
          onChange={(v) => update("vetPhone", v)}
          placeholder="+1 555-987-6543"
        />
      </Field>
      <Field
        label="Date Certificate Signed"
        hint="dd/mm/yyyy format on certificate. Up to 30 days before export for accredited vets."
      >
        <Input
          type="date"
          value={data.vetSignDate}
          onChange={(v) => update("vetSignDate", v)}
        />
      </Field>

      {data.vetType === "accredited" && (
        <Field label="Submission Method">
          <Select
            value={data.submissionMethod}
            onChange={(v) => update("submissionMethod", v)}
            options={[
              {
                value: "paper",
                label: "Paper \u2014 wet signature in blue ink",
              },
              {
                value: "vehcs",
                label:
                  "Electronic \u2014 via VEHCS ('Electronically Signed')",
              },
            ]}
          />
        </Field>
      )}
    </div>
  );
}
