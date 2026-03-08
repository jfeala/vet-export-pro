"use client";

import {
  COUNTRIES_EU,
  SPECIES_OPTIONS,
} from "@/lib/certificates/en-es-2019-1293/constants";
import type {
  CertificateFormData,
  Pet,
} from "@/lib/certificates/en-es-2019-1293/types";
import { formatDateEU } from "@/lib/dates";

interface Props {
  data: CertificateFormData;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h4 className="text-sm text-primary font-semibold uppercase tracking-wide border-b border-border-light pb-2 mb-3">
        {title}
      </h4>
      <div className="text-sm leading-loose text-text">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-text-muted min-w-[180px]">{label}:</span>
      <span className="font-medium">{value || "\u2014"}</span>
    </div>
  );
}

export function ReviewStep({ data }: Props) {
  const dest = COUNTRIES_EU.find((c) => c.code === data.destinationCountry);
  const pets = data.pets || [];

  return (
    <div>
      <h3 className="text-xl font-semibold text-text mb-1 font-serif">
        Review & Generate
      </h3>
      <p className="text-sm text-text-muted mt-0 mb-6">
        Please review all information carefully. This data will be used to
        generate the completed EU health certificate (EN-ES 2019-1293).
      </p>

      <Section title="Owner / Consignor">
        <ReviewRow
          label="Traveler"
          value={
            data.travelingPerson === "owner"
              ? "Owner"
              : data.travelingPerson === "authorized"
                ? "Authorized person"
                : `Carrier: ${data.carrierName}`
          }
        />
        <ReviewRow label="U.S. Name" value={data.ownerNameUS} />
        <ReviewRow label="U.S. Address" value={data.ownerAddressUS} />
        <ReviewRow label="EU Name" value={data.ownerNameEU} />
        <ReviewRow label="EU Address" value={data.ownerAddressEU} />
      </Section>

      <Section title="Travel">
        <ReviewRow label="Destination" value={dest?.name || ""} />
        <ReviewRow
          label="Departure"
          value={formatDateEU(data.departureDate)}
        />
        <ReviewRow label="Transport" value={data.transportMeans} />
        <ReviewRow label="EU Entry Point" value={data.entryBIP} />
      </Section>

      {pets.map((pet: Pet, i: number) => (
        <Section
          key={pet.id}
          title={`Pet #${i + 1} \u2014 ${SPECIES_OPTIONS.find((s) => s.value === pet.species)?.label || "Unknown"}`}
        >
          <ReviewRow label="Breed" value={pet.breed} />
          <ReviewRow label="Sex" value={pet.sex} />
          <ReviewRow label="Color" value={pet.color} />
          <ReviewRow label="DOB" value={formatDateEU(pet.dateOfBirth)} />
          <ReviewRow label="Microchip" value={pet.identificationNumber} />
          <ReviewRow
            label="Chip Date"
            value={formatDateEU(pet.microchipImplantDate)}
          />
          <ReviewRow
            label="Rabies Vaccine"
            value={`${pet.rabiesVaccineName} (${pet.rabiesVaccineManufacturer})`}
          />
          <ReviewRow
            label="Vaccinated"
            value={formatDateEU(pet.rabiesVaccinationDate)}
          />
          <ReviewRow
            label="Valid"
            value={`${formatDateEU(pet.rabiesValidFrom)} \u2192 ${formatDateEU(pet.rabiesValidTo)}`}
          />
          {pet.tapewormProductName && (
            <ReviewRow
              label="Tapeworm Tx"
              value={`${pet.tapewormProductName} on ${formatDateEU(pet.tapewormTreatmentDate)} at ${pet.tapewormTreatmentTime || "\u2014"}`}
            />
          )}
        </Section>
      ))}

      <Section title="Veterinarian">
        <ReviewRow label="Name" value={data.vetName} />
        <ReviewRow
          label="Type"
          value={
            data.vetType === "military"
              ? "Military Veterinarian"
              : "USDA Accredited Veterinarian"
          }
        />
        <ReviewRow
          label="Signed"
          value={formatDateEU(data.vetSignDate)}
        />
      </Section>

      <div className="flex gap-3 mt-6">
        <button className="flex-1 py-3.5 px-6 bg-primary text-white border-none rounded-xl text-[15px] font-bold cursor-pointer hover:bg-primary-dark transition-colors">
          Generate Health Certificate PDF
        </button>
        <button className="py-3.5 px-6 bg-white text-primary border-[1.5px] border-primary rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-primary/5 transition-colors">
          Save Draft
        </button>
      </div>
    </div>
  );
}
