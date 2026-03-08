"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Row } from "@/components/ui/row";
import { InfoBanner } from "@/components/ui/info-banner";
import {
  SPECIES_OPTIONS,
  SEX_OPTIONS,
  ID_SYSTEM_OPTIONS,
} from "@/lib/certificates/en-es-2019-1293/constants";
import type {
  CertificateFormData,
  Pet,
} from "@/lib/certificates/en-es-2019-1293/types";
import { emptyPet } from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function PetsStep({ data, update }: Props) {
  const pets = data.pets || [emptyPet()];

  const updatePet = (index: number, field: keyof Pet, value: string) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };
    update("pets", updated);
  };

  const addPet = () => {
    if (pets.length >= 5) return;
    update("pets", [...pets, emptyPet()]);
  };

  const removePet = (index: number) => {
    if (pets.length <= 1) return;
    update(
      "pets",
      pets.filter((_: Pet, i: number) => i !== index)
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Pet Information
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        Box I.28 — Each animal must be listed individually. Maximum 5 pets
        unless traveling for a competition/exhibition (pets must be 6+ months
        old).
      </p>

      <InfoBanner type="info">
        The microchip number entered here must{" "}
        <strong>exactly match</strong> the number on the rabies vaccination
        certificate. The vet must scan and verify the microchip before completing
        any part of the certificate.
      </InfoBanner>

      {pets.map((pet: Pet, i: number) => (
        <div
          key={pet.id}
          className="border-[1.5px] border-border rounded-xl p-5 mb-4 bg-surface relative"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[15px] font-semibold text-primary">
              Pet #{i + 1}{" "}
              {pet.species
                ? `\u2014 ${SPECIES_OPTIONS.find((s) => s.value === pet.species)?.label || ""}`
                : ""}
            </h4>
            {pets.length > 1 && (
              <button
                onClick={() => removePet(i)}
                className="bg-transparent border border-danger text-danger rounded-md px-3 py-1 text-xs cursor-pointer hover:bg-danger/5"
              >
                Remove
              </button>
            )}
          </div>

          <Row cols={3}>
            <Field label="Species" required>
              <Select
                value={pet.species}
                onChange={(v) => updatePet(i, "species", v)}
                options={[...SPECIES_OPTIONS]}
              />
            </Field>
            <Field label="Sex" required>
              <Select
                value={pet.sex}
                onChange={(v) => updatePet(i, "sex", v)}
                options={[...SEX_OPTIONS]}
              />
            </Field>
            <Field label="Date of Birth" required hint="dd/mm/yyyy on certificate">
              <Input
                type="date"
                value={pet.dateOfBirth}
                onChange={(v) => updatePet(i, "dateOfBirth", v)}
              />
            </Field>
          </Row>

          <Row cols={3}>
            <Field label="Color" required>
              <Input
                value={pet.color}
                onChange={(v) => updatePet(i, "color", v)}
                placeholder="e.g., Black and tan"
              />
            </Field>
            <Field label="Breed" required hint="As stated by owner">
              <Input
                value={pet.breed}
                onChange={(v) => updatePet(i, "breed", v)}
                placeholder="e.g., Labrador Retriever"
              />
            </Field>
            <Field label="Identification System" required>
              <Select
                value={pet.identificationSystem}
                onChange={(v) => updatePet(i, "identificationSystem", v)}
                options={[...ID_SYSTEM_OPTIONS]}
              />
            </Field>
          </Row>

          <Row>
            <Field
              label={`${pet.identificationSystem || "Microchip"} Number`}
              required
              hint="This must match the rabies vaccination certificate exactly."
            >
              <Input
                value={pet.identificationNumber}
                onChange={(v) => updatePet(i, "identificationNumber", v)}
                placeholder="e.g., 985112345678901"
              />
            </Field>
            <Field
              label="Microchip Implant / Reading Date"
              required
              hint="Must be on or before the rabies vaccination date."
            >
              <Input
                type="date"
                value={pet.microchipImplantDate}
                onChange={(v) => updatePet(i, "microchipImplantDate", v)}
              />
            </Field>
          </Row>
        </div>
      ))}

      {pets.length < 5 && (
        <button
          onClick={addPet}
          className="w-full p-3 border-2 border-dashed border-primary/30 rounded-xl bg-transparent text-primary text-sm font-semibold cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          + Add Another Pet
        </button>
      )}

      {pets.length > 5 && (
        <Field
          label="Competition / Exhibition Details"
          required
          hint="Required when traveling with more than 5 pets (must be 6+ months old)."
        >
          <Input
            value={data.competitionDetails}
            onChange={(v) => update("competitionDetails", v)}
            placeholder="Name of event or organizing association"
          />
        </Field>
      )}
    </div>
  );
}
