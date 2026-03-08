"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Row } from "@/components/ui/row";
import { InfoBanner } from "@/components/ui/info-banner";
import {
  COUNTRIES_EU,
  TAPEWORM_REQUIRED,
} from "@/lib/certificates/en-es-2019-1293/constants";
import type {
  CertificateFormData,
  Pet,
} from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function TapewormStep({ data, update }: Props) {
  const dest = COUNTRIES_EU.find((c) => c.code === data.destinationCountry);
  const needsTapeworm = TAPEWORM_REQUIRED.includes(data.destinationCountry);
  const dogs = (data.pets || []).filter(
    (p: Pet) => p.species === "Canis familiaris"
  );
  const hasDogs = dogs.length > 0;

  const updatePet = (petId: number, field: keyof Pet, value: string) => {
    const updated = (data.pets || []).map((p: Pet) =>
      p.id === petId ? { ...p, [field]: value } : p
    );
    update("pets", updated);
  };

  if (!hasDogs) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-text mb-1 font-serif">
          Tapeworm Treatment
        </h3>
        <InfoBanner type="success">
          No dogs in this certificate — tapeworm (Echinococcus) treatment only
          applies to dogs. You can skip this step.
        </InfoBanner>
      </div>
    );
  }

  if (!needsTapeworm) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-text mb-1 font-serif">
          Tapeworm Treatment
        </h3>
        <InfoBanner type="success">
          <strong>{dest?.name || "Your destination"}</strong> does not require
          Echinococcus (tapeworm) treatment. On the certificate, the &ldquo;have
          been treated&rdquo; option will be struck through and &ldquo;have not
          been treated&rdquo; will be selected. The treatment table will be left
          blank (not struck through — an EU vet may use it later).
        </InfoBanner>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Tapeworm Treatment
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        Section II.4 — Required for dogs traveling to {dest?.name}. Treatment
        must be administered by a USDA Accredited Vet 1&ndash;5 days before
        arrival.
      </p>

      <InfoBanner type="warning">
        The medication must contain <strong>praziquantel</strong> or be proven
        effective against <em>E. multilocularis</em>.
        {data.destinationCountry === "NO" && (
          <>
            {" "}
            Norway specifically requires{" "}
            <strong>praziquantel or epsiprantel</strong>.
          </>
        )}{" "}
        The vet cannot sign the treatment table until after administering the
        treatment. This can be done before or after APHIS endorsement.
      </InfoBanner>

      {dogs.map((dog: Pet) => (
        <div
          key={dog.id}
          className="border-[1.5px] border-border rounded-xl p-5 mb-4 bg-surface"
        >
          <h4 className="text-[15px] font-semibold text-primary mb-4">
            {dog.breed || "Dog"}{" "}
            <span className="font-normal text-text-muted text-sm">
              ({dog.identificationNumber})
            </span>
          </h4>
          <Row>
            <Field label="Product Name" required>
              <Input
                value={dog.tapewormProductName}
                onChange={(v) =>
                  updatePet(dog.id, "tapewormProductName", v)
                }
                placeholder="e.g., Droncit"
              />
            </Field>
            <Field label="Product Manufacturer" required>
              <Input
                value={dog.tapewormManufacturer}
                onChange={(v) =>
                  updatePet(dog.id, "tapewormManufacturer", v)
                }
                placeholder="e.g., Bayer"
              />
            </Field>
          </Row>
          <Row>
            <Field
              label="Treatment Date"
              required
              hint="Must be 1\u20135 days before EU arrival."
            >
              <Input
                type="date"
                value={dog.tapewormTreatmentDate}
                onChange={(v) =>
                  updatePet(dog.id, "tapewormTreatmentDate", v)
                }
              />
            </Field>
            <Field
              label="Treatment Time"
              required
              hint="24-hour format (HH:MM) — required on the certificate."
            >
              <Input
                type="time"
                value={dog.tapewormTreatmentTime}
                onChange={(v) =>
                  updatePet(dog.id, "tapewormTreatmentTime", v)
                }
              />
            </Field>
          </Row>
          <Field
            label="Administering Veterinarian Name"
            required
            hint="Must be a USDA Accredited Vet (not the owner). Name in CAPITALS on the certificate."
          >
            <Input
              value={dog.tapewormVetName}
              onChange={(v) => updatePet(dog.id, "tapewormVetName", v)}
              placeholder="DR. JOHN SMITH"
            />
          </Field>
        </div>
      ))}
    </div>
  );
}
