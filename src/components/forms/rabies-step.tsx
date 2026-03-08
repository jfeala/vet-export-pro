"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Row } from "@/components/ui/row";
import { InfoBanner } from "@/components/ui/info-banner";
import { SPECIES_OPTIONS } from "@/lib/certificates/en-es-2019-1293/constants";
import type {
  CertificateFormData,
  Pet,
} from "@/lib/certificates/en-es-2019-1293/types";

interface Props {
  data: CertificateFormData;
  update: (field: string, value: unknown) => void;
}

export function RabiesStep({ data, update }: Props) {
  const pets = data.pets || [];

  const updatePet = (index: number, field: keyof Pet, value: string) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };
    update("pets", updated);
  };

  const getAgeWeeks = (dob: string): number | null => {
    if (!dob || !data.departureDate) return null;
    const birth = new Date(dob);
    const depart = new Date(data.departureDate);
    return Math.floor(
      (depart.getTime() - birth.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Rabies Vaccination Details
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        Section II.3 — This populates the vaccination table. Information must
        exactly match the rabies vaccination certificate.
      </p>

      <InfoBanner type="info">
        Since the U.S. is listed in Annex II to Regulation (EU) No 577/2013,
        rabies antibody titration testing is <strong>not required</strong>. That
        column will be struck through on the certificate.
      </InfoBanner>

      {pets.map((pet: Pet, i: number) => {
        const ageWeeks = getAgeWeeks(pet.dateOfBirth);
        const isYoungPet = ageWeeks !== null && ageWeeks < 16;

        return (
          <div
            key={pet.id}
            className="border-[1.5px] border-border rounded-xl p-5 mb-4 bg-surface"
          >
            <h4 className="text-[15px] font-semibold text-primary mb-1">
              {SPECIES_OPTIONS.find((s) => s.value === pet.species)?.label ||
                `Pet #${i + 1}`}
              {pet.breed ? ` \u2014 ${pet.breed}` : ""}
              <span className="font-normal text-text-muted text-sm">
                {" "}
                ({pet.identificationNumber || "no ID yet"})
              </span>
            </h4>
            {ageWeeks !== null && (
              <p className="text-xs text-text-muted mt-1 mb-4">
                Age at departure: ~{ageWeeks} weeks
                {isYoungPet &&
                  " \u2014 This pet may qualify under the young animal exception (Section II.3 option 1)"}
              </p>
            )}

            {isYoungPet && (
              <Field label="Young Pet Rabies Status" required>
                <Select
                  value={pet.youngPetStatus || ""}
                  onChange={(v) => updatePet(i, "youngPetStatus", v)}
                  options={[
                    {
                      value: "under12_unvaccinated",
                      label: "Under 12 weeks, not vaccinated for rabies",
                    },
                    {
                      value: "12to16_vaccinated_waiting",
                      label:
                        "12\u201316 weeks, vaccinated but 21 days haven\u2019t elapsed",
                    },
                    {
                      value: "vaccinated_valid",
                      label: "Vaccinated and 21+ days have passed",
                    },
                    {
                      value: "traveling_with_mother",
                      label: "Traveling with vaccinated mother",
                    },
                  ]}
                />
              </Field>
            )}

            {(!isYoungPet ||
              pet.youngPetStatus === "vaccinated_valid" ||
              pet.youngPetStatus === "12to16_vaccinated_waiting") && (
              <>
                <Row>
                  <Field
                    label="Rabies Vaccination Date"
                    required
                    hint="Must be on or after microchip implant date. dd/mm/yyyy on cert."
                  >
                    <Input
                      type="date"
                      value={pet.rabiesVaccinationDate}
                      onChange={(v) =>
                        updatePet(i, "rabiesVaccinationDate", v)
                      }
                    />
                  </Field>
                  <Field
                    label="Batch / Serial Number"
                    required
                    hint="From the rabies vaccine vial"
                  >
                    <Input
                      value={pet.rabiesBatchNumber}
                      onChange={(v) => updatePet(i, "rabiesBatchNumber", v)}
                      placeholder="e.g., A1234B"
                    />
                  </Field>
                </Row>
                <Row>
                  <Field label="Vaccine Name" required>
                    <Input
                      value={pet.rabiesVaccineName}
                      onChange={(v) => updatePet(i, "rabiesVaccineName", v)}
                      placeholder="e.g., Imrab 3"
                    />
                  </Field>
                  <Field label="Vaccine Manufacturer" required>
                    <Input
                      value={pet.rabiesVaccineManufacturer}
                      onChange={(v) =>
                        updatePet(i, "rabiesVaccineManufacturer", v)
                      }
                      placeholder="e.g., Boehringer Ingelheim"
                    />
                  </Field>
                </Row>
                <Row>
                  <Field
                    label="Vaccination Valid From"
                    required
                    hint="Usually same as vaccination date, or 21 days after for primary."
                  >
                    <Input
                      type="date"
                      value={pet.rabiesValidFrom}
                      onChange={(v) => updatePet(i, "rabiesValidFrom", v)}
                    />
                  </Field>
                  <Field
                    label="Vaccination Valid To"
                    required
                    hint="1 or 3 years depending on manufacturer instructions."
                  >
                    <Input
                      type="date"
                      value={pet.rabiesValidTo}
                      onChange={(v) => updatePet(i, "rabiesValidTo", v)}
                    />
                  </Field>
                </Row>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
