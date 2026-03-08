import { useState, useEffect, useCallback } from "react";

const COUNTRIES_EU = [
  { code: "AT", name: "Austria" }, { code: "BE", name: "Belgium" }, { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" }, { code: "CY", name: "Cyprus" }, { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" }, { code: "EE", name: "Estonia" }, { code: "FI", name: "Finland" },
  { code: "FR", name: "France" }, { code: "DE", name: "Germany" }, { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" }, { code: "IE", name: "Ireland" }, { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" }, { code: "LT", name: "Lithuania" }, { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" }, { code: "NL", name: "Netherlands" }, { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" }, { code: "RO", name: "Romania" }, { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" }, { code: "ES", name: "Spain" }, { code: "SE", name: "Sweden" },
  { code: "GB-ENG", name: "England (UK)" }, { code: "GB-NIR", name: "Northern Ireland (UK)" },
  { code: "GB-SCT", name: "Scotland (UK)" }, { code: "GB-WLS", name: "Wales (UK)" },
  { code: "NO", name: "Norway" },
];

const TAPEWORM_REQUIRED = ["FI", "IE", "MT", "NO", "GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"];

const SPECIES_OPTIONS = [
  { value: "Canis familiaris", label: "Dog" },
  { value: "Felis catus", label: "Cat" },
  { value: "Mustela putorius furo", label: "Ferret" },
];

const SEX_OPTIONS = ["Female", "Male", "Spayed female", "Neutered male"];

const ID_SYSTEM_OPTIONS = ["Transponder", "Tattoo"];

const STEPS = [
  { id: "owner", label: "Owner Info", icon: "👤" },
  { id: "destination", label: "Travel Details", icon: "✈️" },
  { id: "pets", label: "Pet Details", icon: "🐾" },
  { id: "rabies", label: "Rabies Vaccine", icon: "💉" },
  { id: "tapeworm", label: "Tapeworm Tx", icon: "💊" },
  { id: "vet", label: "Veterinarian", icon: "🩺" },
  { id: "review", label: "Review", icon: "✅" },
];

const emptyPet = () => ({
  id: Date.now(),
  species: "",
  sex: "",
  color: "",
  breed: "",
  identificationNumber: "",
  identificationSystem: "Transponder",
  dateOfBirth: "",
  microchipImplantDate: "",
  rabiesVaccinationDate: "",
  rabiesVaccineName: "",
  rabiesVaccineManufacturer: "",
  rabiesBatchNumber: "",
  rabiesValidFrom: "",
  rabiesValidTo: "",
  tapewormProductName: "",
  tapewormManufacturer: "",
  tapewormTreatmentDate: "",
  tapewormTreatmentTime: "",
  tapewormVetName: "",
});

function Field({ label, required, hint, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 13, fontWeight: 600,
        color: "#1a1a2e", marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.02em"
      }}>
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </label>
      {hint && <div style={{ fontSize: 12, color: "#6b7c93", marginBottom: 6, lineHeight: 1.4, fontStyle: "italic" }}>{hint}</div>}
      {children}
      {error && <div style={{ fontSize: 12, color: "#c0392b", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1.5px solid #d1d9e6",
  borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  background: "#fff", color: "#1a1a2e", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const selectStyle = { ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%236b7c93'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" };

function Input({ value, onChange, placeholder, type = "text", ...rest }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={inputStyle}
    onFocus={e => { e.target.style.borderColor = "#2d6a4f"; e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.1)"; }}
    onBlur={e => { e.target.style.borderColor = "#d1d9e6"; e.target.style.boxShadow = "none"; }}
    {...rest} />;
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}
      onFocus={e => { e.target.style.borderColor = "#2d6a4f"; e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "#d1d9e6"; e.target.style.boxShadow = "none"; }}>
      <option value="">{placeholder || "Select..."}</option>
      {options.map(o => typeof o === "string"
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  );
}

function Row({ children, cols = 2 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>;
}

function InfoBanner({ type = "info", children }) {
  const colors = {
    info: { bg: "#eef4f0", border: "#2d6a4f", icon: "ℹ️" },
    warning: { bg: "#fef9e7", border: "#d4a017", icon: "⚠️" },
    success: { bg: "#eafaf1", border: "#27ae60", icon: "✓" },
  };
  const c = colors[type];
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 8, background: c.bg,
      borderLeft: `3px solid ${c.border}`, marginBottom: 20, fontSize: 13,
      lineHeight: 1.5, color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ marginRight: 8 }}>{c.icon}</span>{children}
    </div>
  );
}

function OwnerStep({ data, update }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Owner / Consignor Information</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        This maps to Boxes I.1 and I.5 of the health certificate. Enter details for the person responsible for the pet during travel.
      </p>

      <Field label="Who is traveling with the pet?" required hint="This determines the 'responsibility' clause in Section II.1 of the certificate.">
        <Select value={data.travelingPerson} onChange={v => update("travelingPerson", v)} options={[
          { value: "owner", label: "The owner" },
          { value: "authorized", label: "An authorized person (with written permission from owner)" },
          { value: "carrier", label: "A carrier/pet travel agent contracted by owner" },
        ]} />
      </Field>

      {data.travelingPerson === "carrier" && (
        <Field label="Carrier / Pet Travel Agent Name" required>
          <Input value={data.carrierName} onChange={v => update("carrierName", v)} placeholder="e.g., PetRelocation LLC" />
        </Field>
      )}

      <h4 style={{ fontSize: 14, color: "#2d6a4f", margin: "28px 0 12px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
        U.S. Contact Info (Box I.1 — Consignor)
      </h4>
      <Row>
        <Field label="Full Name" required>
          <Input value={data.ownerNameUS} onChange={v => update("ownerNameUS", v)} placeholder="Jane Smith" />
        </Field>
        <Field label="Phone Number" required>
          <Input value={data.ownerPhoneUS} onChange={v => update("ownerPhoneUS", v)} placeholder="+1 555-123-4567" />
        </Field>
      </Row>
      <Field label="U.S. Street Address" required>
        <Input value={data.ownerAddressUS} onChange={v => update("ownerAddressUS", v)} placeholder="123 Main St, Springfield, IL 62704" />
      </Field>

      <h4 style={{ fontSize: 14, color: "#2d6a4f", margin: "28px 0 12px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
        EU Contact Info (Box I.5 — Consignee)
      </h4>
      <Row>
        <Field label="Full Name at Destination" required>
          <Input value={data.ownerNameEU} onChange={v => update("ownerNameEU", v)} placeholder="Jane Smith" />
        </Field>
        <Field label="Phone Number at Destination">
          <Input value={data.ownerPhoneEU} onChange={v => update("ownerPhoneEU", v)} placeholder="+44 20 7946 0958" />
        </Field>
      </Row>
      <Field label="EU Street Address" required hint="Include city, postal code, and country name.">
        <Input value={data.ownerAddressEU} onChange={v => update("ownerAddressEU", v)} placeholder="10 Downing Street, London SW1A 2AA, England" />
      </Field>
      <Field label="EU Postal Code" required>
        <Input value={data.ownerPostalCodeEU} onChange={v => update("ownerPostalCodeEU", v)} placeholder="SW1A 2AA" />
      </Field>
    </div>
  );
}

function DestinationStep({ data, update }) {
  const dest = COUNTRIES_EU.find(c => c.code === data.destinationCountry);
  const needsTapeworm = data.destinationCountry && TAPEWORM_REQUIRED.includes(data.destinationCountry);

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Travel Details</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        This populates Boxes I.9, I.14, I.15, and I.16 of the certificate.
      </p>

      <Field label="EU Country of Destination" required hint="This determines tapeworm treatment requirements and which certificate options apply.">
        <Select value={data.destinationCountry} onChange={v => update("destinationCountry", v)}
          options={COUNTRIES_EU.map(c => ({ value: c.code, label: c.name }))} placeholder="Select destination country..." />
      </Field>

      {needsTapeworm && (
        <InfoBanner type="warning">
          <strong>{dest?.name}</strong> requires Echinococcus (tapeworm) treatment for dogs. The treatment must be administered by a USDA Accredited Veterinarian between 1–5 days before arrival. You'll fill in treatment details in a later step.
        </InfoBanner>
      )}

      <Row>
        <Field label="Date of Departure from U.S." required hint="The certificate must be endorsed by APHIS within 10 days of EU arrival.">
          <Input type="date" value={data.departureDate} onChange={v => update("departureDate", v)} />
        </Field>
        <Field label="Means of Transport" required hint="Box I.15 — e.g., 'Aeroplane', 'Ship'">
          <Select value={data.transportMeans} onChange={v => update("transportMeans", v)}
            options={["Aeroplane", "Ship", "Railway wagon", "Road vehicle"]} />
        </Field>
      </Row>

      <Row>
        <Field label="Place of Loading" hint="Box I.13 — Airport/port of departure, e.g., 'JFK Airport, New York'">
          <Input value={data.placeOfLoading} onChange={v => update("placeOfLoading", v)} placeholder="JFK Airport, New York" />
        </Field>
        <Field label="EU Entry Point (BIP)" hint="Box I.16 — The Travellers' Point of Entry in the EU where documentary/identity checks occur.">
          <Input value={data.entryBIP} onChange={v => update("entryBIP", v)} placeholder="e.g., Heathrow Airport, London" />
        </Field>
      </Row>

      <Field label="Place of Destination" hint="Box I.12 — Final destination address (can be same as EU address above).">
        <Input value={data.placeOfDestination} onChange={v => update("placeOfDestination", v)} placeholder="Same as EU address, or specify" />
      </Field>
    </div>
  );
}

function PetsStep({ data, update }) {
  const pets = data.pets || [emptyPet()];

  const updatePet = (index, field, value) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };
    update("pets", updated);
  };

  const addPet = () => {
    if (pets.length >= 5) return;
    update("pets", [...pets, emptyPet()]);
  };

  const removePet = (index) => {
    if (pets.length <= 1) return;
    update("pets", pets.filter((_, i) => i !== index));
  };

  const hasDog = pets.some(p => p.species === "Canis familiaris");

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Pet Information</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Box I.28 — Each animal must be listed individually. Maximum 5 pets unless traveling for a competition/exhibition (pets must be 6+ months old).
      </p>

      <InfoBanner type="info">
        The microchip number entered here must <strong>exactly match</strong> the number on the rabies vaccination certificate. The vet must scan and verify the microchip before completing any part of the certificate.
      </InfoBanner>

      {pets.map((pet, i) => (
        <div key={pet.id} style={{
          border: "1.5px solid #d1d9e6", borderRadius: 12, padding: 20, marginBottom: 16,
          background: "#fafcff", position: "relative"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ margin: 0, fontSize: 15, color: "#2d6a4f", fontFamily: "'DM Sans', sans-serif" }}>
              Pet #{i + 1} {pet.species ? `— ${SPECIES_OPTIONS.find(s => s.value === pet.species)?.label || ""}` : ""}
            </h4>
            {pets.length > 1 && (
              <button onClick={() => removePet(i)} style={{
                background: "none", border: "1px solid #e74c3c", color: "#e74c3c",
                borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12,
              }}>Remove</button>
            )}
          </div>

          <Row cols={3}>
            <Field label="Species" required>
              <Select value={pet.species} onChange={v => updatePet(i, "species", v)} options={SPECIES_OPTIONS} />
            </Field>
            <Field label="Sex" required>
              <Select value={pet.sex} onChange={v => updatePet(i, "sex", v)} options={SEX_OPTIONS} />
            </Field>
            <Field label="Date of Birth" required hint="dd/mm/yyyy on certificate">
              <Input type="date" value={pet.dateOfBirth} onChange={v => updatePet(i, "dateOfBirth", v)} />
            </Field>
          </Row>

          <Row cols={3}>
            <Field label="Color" required>
              <Input value={pet.color} onChange={v => updatePet(i, "color", v)} placeholder="e.g., Black and tan" />
            </Field>
            <Field label="Breed" required hint="As stated by owner">
              <Input value={pet.breed} onChange={v => updatePet(i, "breed", v)} placeholder="e.g., Labrador Retriever" />
            </Field>
            <Field label="Identification System" required>
              <Select value={pet.identificationSystem} onChange={v => updatePet(i, "identificationSystem", v)} options={ID_SYSTEM_OPTIONS} />
            </Field>
          </Row>

          <Row>
            <Field label={`${pet.identificationSystem || "Microchip"} Number`} required hint="This must match the rabies vaccination certificate exactly.">
              <Input value={pet.identificationNumber} onChange={v => updatePet(i, "identificationNumber", v)} placeholder="e.g., 985112345678901" />
            </Field>
            <Field label="Microchip Implant / Reading Date" required hint="Must be on or before the rabies vaccination date.">
              <Input type="date" value={pet.microchipImplantDate} onChange={v => updatePet(i, "microchipImplantDate", v)} />
            </Field>
          </Row>
        </div>
      ))}

      {pets.length < 5 && (
        <button onClick={addPet} style={{
          width: "100%", padding: 12, border: "2px dashed #b8c9b8", borderRadius: 10,
          background: "none", color: "#2d6a4f", fontSize: 14, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        }}>
          + Add Another Pet
        </button>
      )}

      {pets.length > 5 && (
        <Field label="Competition / Exhibition Details" required hint="Required when traveling with more than 5 pets (must be 6+ months old).">
          <Input value={data.competitionDetails} onChange={v => update("competitionDetails", v)}
            placeholder="Name of event or organizing association" />
        </Field>
      )}
    </div>
  );
}

function RabiesStep({ data, update }) {
  const pets = data.pets || [];

  const updatePet = (index, field, value) => {
    const updated = [...pets];
    updated[index] = { ...updated[index], [field]: value };
    update("pets", updated);
  };

  // Calculate age at departure
  const getAgeWeeks = (dob) => {
    if (!dob || !data.departureDate) return null;
    const birth = new Date(dob);
    const depart = new Date(data.departureDate);
    return Math.floor((depart - birth) / (7 * 24 * 60 * 60 * 1000));
  };

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Rabies Vaccination Details</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Section II.3 — This populates the vaccination table. Information must exactly match the rabies vaccination certificate.
      </p>

      <InfoBanner type="info">
        Since the U.S. is listed in Annex II to Regulation (EU) No 577/2013, rabies antibody titration testing is <strong>not required</strong>. That column will be struck through on the certificate.
      </InfoBanner>

      {pets.map((pet, i) => {
        const ageWeeks = getAgeWeeks(pet.dateOfBirth);
        const isYoungPet = ageWeeks !== null && ageWeeks < 16;

        return (
          <div key={pet.id} style={{
            border: "1.5px solid #d1d9e6", borderRadius: 12, padding: 20, marginBottom: 16,
            background: "#fafcff",
          }}>
            <h4 style={{ margin: "0 0 4px", fontSize: 15, color: "#2d6a4f" }}>
              {SPECIES_OPTIONS.find(s => s.value === pet.species)?.label || `Pet #${i + 1}`}
              {pet.breed ? ` — ${pet.breed}` : ""}
              <span style={{ fontWeight: 400, color: "#6b7c93", fontSize: 13 }}>
                {" "}({pet.identificationNumber || "no ID yet"})
              </span>
            </h4>
            {ageWeeks !== null && <p style={{ fontSize: 12, color: "#6b7c93", margin: "4px 0 16px" }}>
              Age at departure: ~{ageWeeks} weeks
              {isYoungPet && " — This pet may qualify under the young animal exception (Section II.3 option 1)"}
            </p>}

            {isYoungPet && (
              <Field label="Young Pet Rabies Status" required>
                <Select value={pet.youngPetStatus} onChange={v => updatePet(i, "youngPetStatus", v)} options={[
                  { value: "under12_unvaccinated", label: "Under 12 weeks, not vaccinated for rabies" },
                  { value: "12to16_vaccinated_waiting", label: "12–16 weeks, vaccinated but 21 days haven't elapsed" },
                  { value: "vaccinated_valid", label: "Vaccinated and 21+ days have passed" },
                  { value: "traveling_with_mother", label: "Traveling with vaccinated mother" },
                ]} />
              </Field>
            )}

            {(!isYoungPet || pet.youngPetStatus === "vaccinated_valid" || pet.youngPetStatus === "12to16_vaccinated_waiting") && (
              <>
                <Row>
                  <Field label="Rabies Vaccination Date" required hint="Must be on or after microchip implant date. dd/mm/yyyy on cert.">
                    <Input type="date" value={pet.rabiesVaccinationDate} onChange={v => updatePet(i, "rabiesVaccinationDate", v)} />
                  </Field>
                  <Field label="Batch / Serial Number" required hint="From the rabies vaccine vial">
                    <Input value={pet.rabiesBatchNumber} onChange={v => updatePet(i, "rabiesBatchNumber", v)} placeholder="e.g., A1234B" />
                  </Field>
                </Row>
                <Row>
                  <Field label="Vaccine Name" required>
                    <Input value={pet.rabiesVaccineName} onChange={v => updatePet(i, "rabiesVaccineName", v)} placeholder="e.g., Imrab 3" />
                  </Field>
                  <Field label="Vaccine Manufacturer" required>
                    <Input value={pet.rabiesVaccineManufacturer} onChange={v => updatePet(i, "rabiesVaccineManufacturer", v)} placeholder="e.g., Boehringer Ingelheim" />
                  </Field>
                </Row>
                <Row>
                  <Field label="Vaccination Valid From" required hint="Usually same as vaccination date, or 21 days after for primary.">
                    <Input type="date" value={pet.rabiesValidFrom} onChange={v => updatePet(i, "rabiesValidFrom", v)} />
                  </Field>
                  <Field label="Vaccination Valid To" required hint="1 or 3 years depending on manufacturer instructions.">
                    <Input type="date" value={pet.rabiesValidTo} onChange={v => updatePet(i, "rabiesValidTo", v)} />
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

function TapewormStep({ data, update }) {
  const dest = COUNTRIES_EU.find(c => c.code === data.destinationCountry);
  const needsTapeworm = TAPEWORM_REQUIRED.includes(data.destinationCountry);
  const dogs = (data.pets || []).filter(p => p.species === "Canis familiaris");
  const hasDogs = dogs.length > 0;

  const updatePet = (petId, field, value) => {
    const updated = (data.pets || []).map(p => p.id === petId ? { ...p, [field]: value } : p);
    update("pets", updated);
  };

  if (!hasDogs) {
    return (
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Tapeworm Treatment</h3>
        <InfoBanner type="success">
          No dogs in this certificate — tapeworm (Echinococcus) treatment only applies to dogs. You can skip this step.
        </InfoBanner>
      </div>
    );
  }

  if (!needsTapeworm) {
    return (
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Tapeworm Treatment</h3>
        <InfoBanner type="success">
          <strong>{dest?.name || "Your destination"}</strong> does not require Echinococcus (tapeworm) treatment. On the certificate, the "have been treated" option will be struck through and "have not been treated" will be selected. The treatment table will be left blank (not struck through — an EU vet may use it later).
        </InfoBanner>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Tapeworm Treatment</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Section II.4 — Required for dogs traveling to {dest?.name}. Treatment must be administered by a USDA Accredited Vet 1–5 days before arrival.
      </p>

      <InfoBanner type="warning">
        The medication must contain <strong>praziquantel</strong> or be proven effective against <em>E. multilocularis</em>.
        {(data.destinationCountry === "NO") && <> Norway specifically requires <strong>praziquantel or epsiprantel</strong>.</>}
        {" "}The vet cannot sign the treatment table until after administering the treatment. This can be done before or after APHIS endorsement.
      </InfoBanner>

      {dogs.map((dog, i) => (
        <div key={dog.id} style={{
          border: "1.5px solid #d1d9e6", borderRadius: 12, padding: 20, marginBottom: 16, background: "#fafcff",
        }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 15, color: "#2d6a4f" }}>
            {dog.breed || "Dog"} <span style={{ fontWeight: 400, color: "#6b7c93", fontSize: 13 }}>({dog.identificationNumber})</span>
          </h4>
          <Row>
            <Field label="Product Name" required>
              <Input value={dog.tapewormProductName} onChange={v => updatePet(dog.id, "tapewormProductName", v)} placeholder="e.g., Droncit" />
            </Field>
            <Field label="Product Manufacturer" required>
              <Input value={dog.tapewormManufacturer} onChange={v => updatePet(dog.id, "tapewormManufacturer", v)} placeholder="e.g., Bayer" />
            </Field>
          </Row>
          <Row>
            <Field label="Treatment Date" required hint="Must be 1–5 days before EU arrival.">
              <Input type="date" value={dog.tapewormTreatmentDate} onChange={v => updatePet(dog.id, "tapewormTreatmentDate", v)} />
            </Field>
            <Field label="Treatment Time" required hint="24-hour format (HH:MM) — required on the certificate.">
              <Input type="time" value={dog.tapewormTreatmentTime} onChange={v => updatePet(dog.id, "tapewormTreatmentTime", v)} />
            </Field>
          </Row>
          <Field label="Administering Veterinarian Name" required hint="Must be a USDA Accredited Vet (not the owner). Name in CAPITALS on the certificate.">
            <Input value={dog.tapewormVetName} onChange={v => updatePet(dog.id, "tapewormVetName", v)} placeholder="DR. JOHN SMITH" />
          </Field>
        </div>
      ))}
    </div>
  );
}

function VetStep({ data, update }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Signing Veterinarian</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        The vet who signs the certificate. This populates the signature block at the end of the health certificate.
      </p>

      <Field label="Veterinarian Type" required hint="This determines which title gets struck through on the certificate.">
        <Select value={data.vetType} onChange={v => update("vetType", v)} options={[
          { value: "accredited", label: "USDA Accredited Veterinarian" },
          { value: "military", label: "Military Veterinarian" },
        ]} />
      </Field>

      {data.vetType === "accredited" && (
        <InfoBanner type="info">
          "Official veterinarian" will be struck through. APHIS endorsement (counter-signature and stamp) is <strong>required</strong>. The vet can sign up to 30 days before export, but APHIS must endorse within 10 days of EU arrival.
        </InfoBanner>
      )}
      {data.vetType === "military" && (
        <InfoBanner type="info">
          "Authorised veterinarian" will be struck through. APHIS endorsement is <strong>not required</strong> for Military Veterinarians. Stamp is required.
        </InfoBanner>
      )}

      <Row>
        <Field label="Veterinarian Full Name" required hint="Will appear in CAPITALS on the certificate.">
          <Input value={data.vetName} onChange={v => update("vetName", v)} placeholder="DR. JANE DOE" />
        </Field>
        <Field label="Qualification / Title" required>
          <Input value={data.vetTitle} onChange={v => update("vetTitle", v)}
            placeholder={data.vetType === "military" ? "e.g., CPT, Veterinary Corps" : "e.g., DVM, USDA Accredited"} />
        </Field>
      </Row>
      <Field label="Veterinarian Address" required>
        <Input value={data.vetAddress} onChange={v => update("vetAddress", v)} placeholder="456 Vet Clinic Rd, Springfield, IL 62704" />
      </Field>
      <Field label="Veterinarian Phone" required>
        <Input value={data.vetPhone} onChange={v => update("vetPhone", v)} placeholder="+1 555-987-6543" />
      </Field>
      <Field label="Date Certificate Signed" hint="dd/mm/yyyy format on certificate. Up to 30 days before export for accredited vets.">
        <Input type="date" value={data.vetSignDate} onChange={v => update("vetSignDate", v)} />
      </Field>

      {data.vetType === "accredited" && (
        <Field label="Submission Method">
          <Select value={data.submissionMethod} onChange={v => update("submissionMethod", v)} options={[
            { value: "paper", label: "Paper — wet signature in blue ink" },
            { value: "vehcs", label: "Electronic — via VEHCS ('Electronically Signed')" },
          ]} />
        </Field>
      )}
    </div>
  );
}

function ReviewStep({ data }) {
  const dest = COUNTRIES_EU.find(c => c.code === data.destinationCountry);
  const pets = data.pets || [];

  const formatDate = (d) => {
    if (!d) return "—";
    const [y, m, dd] = d.split("-");
    return `${dd}/${m}/${y}`;
  };

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 14, color: "#2d6a4f", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e8ede8", paddingBottom: 8 }}>{title}</h4>
      <div style={{ fontSize: 13, lineHeight: 1.8, color: "#1a1a2e" }}>{children}</div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ color: "#6b7c93", minWidth: 180 }}>{label}:</span>
      <span style={{ fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 20, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" }}>Review & Generate</h3>
      <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 0, marginBottom: 24 }}>
        Please review all information carefully. This data will be used to generate the completed EU health certificate (EN-ES 2019-1293).
      </p>

      <Section title="Owner / Consignor">
        <Row label="Traveler" value={data.travelingPerson === "owner" ? "Owner" : data.travelingPerson === "authorized" ? "Authorized person" : `Carrier: ${data.carrierName}`} />
        <Row label="U.S. Name" value={data.ownerNameUS} />
        <Row label="U.S. Address" value={data.ownerAddressUS} />
        <Row label="EU Name" value={data.ownerNameEU} />
        <Row label="EU Address" value={data.ownerAddressEU} />
      </Section>

      <Section title="Travel">
        <Row label="Destination" value={dest?.name} />
        <Row label="Departure" value={formatDate(data.departureDate)} />
        <Row label="Transport" value={data.transportMeans} />
        <Row label="EU Entry Point" value={data.entryBIP} />
      </Section>

      {pets.map((pet, i) => (
        <Section key={pet.id} title={`Pet #${i + 1} — ${SPECIES_OPTIONS.find(s => s.value === pet.species)?.label || "Unknown"}`}>
          <Row label="Breed" value={pet.breed} />
          <Row label="Sex" value={pet.sex} />
          <Row label="Color" value={pet.color} />
          <Row label="DOB" value={formatDate(pet.dateOfBirth)} />
          <Row label="Microchip" value={pet.identificationNumber} />
          <Row label="Chip Date" value={formatDate(pet.microchipImplantDate)} />
          <Row label="Rabies Vaccine" value={`${pet.rabiesVaccineName} (${pet.rabiesVaccineManufacturer})`} />
          <Row label="Vaccinated" value={formatDate(pet.rabiesVaccinationDate)} />
          <Row label="Valid" value={`${formatDate(pet.rabiesValidFrom)} → ${formatDate(pet.rabiesValidTo)}`} />
          {pet.tapewormProductName && <Row label="Tapeworm Tx" value={`${pet.tapewormProductName} on ${formatDate(pet.tapewormTreatmentDate)} at ${pet.tapewormTreatmentTime || "—"}`} />}
        </Section>
      ))}

      <Section title="Veterinarian">
        <Row label="Name" value={data.vetName} />
        <Row label="Type" value={data.vetType === "military" ? "Military Veterinarian" : "USDA Accredited Veterinarian"} />
        <Row label="Signed" value={formatDate(data.vetSignDate)} />
      </Section>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button style={{
          flex: 1, padding: "14px 24px", background: "#2d6a4f", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
        }}>
          Generate Health Certificate PDF
        </button>
        <button style={{
          padding: "14px 24px", background: "#fff", color: "#2d6a4f",
          border: "1.5px solid #2d6a4f", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Save Draft
        </button>
      </div>
    </div>
  );
}

export default function PetTravelForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    travelingPerson: "", carrierName: "",
    ownerNameUS: "", ownerPhoneUS: "", ownerAddressUS: "",
    ownerNameEU: "", ownerPhoneEU: "", ownerAddressEU: "", ownerPostalCodeEU: "",
    destinationCountry: "", departureDate: "", transportMeans: "",
    placeOfLoading: "", entryBIP: "", placeOfDestination: "",
    pets: [emptyPet()],
    competitionDetails: "",
    vetType: "", vetName: "", vetTitle: "", vetAddress: "", vetPhone: "",
    vetSignDate: "", submissionMethod: "",
  });

  const update = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Skip tapeworm step if no dogs or no tapeworm-required destination
  const hasDogs = (data.pets || []).some(p => p.species === "Canis familiaris");
  const needsTapeworm = TAPEWORM_REQUIRED.includes(data.destinationCountry);

  const visibleSteps = STEPS.filter(s => {
    if (s.id === "tapeworm" && !hasDogs) return false;
    return true;
  });

  const currentStepId = visibleSteps[step]?.id;

  const renderStep = () => {
    switch (currentStepId) {
      case "owner": return <OwnerStep data={data} update={update} />;
      case "destination": return <DestinationStep data={data} update={update} />;
      case "pets": return <PetsStep data={data} update={update} />;
      case "rabies": return <RabiesStep data={data} update={update} />;
      case "tapeworm": return <TapewormStep data={data} update={update} />;
      case "vet": return <VetStep data={data} update={update} />;
      case "review": return <ReviewStep data={data} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7f5", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3c34 0%, #2d6a4f 60%, #40916c 100%)",
        padding: "28px 32px 20px", color: "#fff",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>🐾</span>
            <h1 style={{ margin: 0, fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.01em" }}>
              EU Pet Travel Certificate
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
            EN-ES 2019-1293 — Non-commercial movement of dogs, cats, or ferrets from the U.S.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8ede8", padding: "12px 32px",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 4, alignItems: "center" }}>
          {visibleSteps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <button
                onClick={() => setStep(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                  borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12,
                  fontWeight: i === step ? 700 : 500, whiteSpace: "nowrap",
                  background: i === step ? "#eef4f0" : i < step ? "#f0faf4" : "transparent",
                  color: i === step ? "#2d6a4f" : i < step ? "#40916c" : "#9ca3af",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 14 }}>{i < step ? "✓" : s.icon}</span>
                <span style={{ display: window.innerWidth > 700 ? "inline" : "none" }}>{s.label}</span>
              </button>
              {i < visibleSteps.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? "#40916c" : "#e5e7eb", margin: "0 4px", minWidth: 8 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 32px 120px" }}>
        <div style={{
          background: "#fff", borderRadius: 14, padding: "28px 32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
          border: "1px solid #e8ede8",
        }}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e8ede8",
        padding: "12px 32px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: "10px 24px", borderRadius: 8, border: "1.5px solid #d1d9e6",
              background: "#fff", color: step === 0 ? "#ccc" : "#1a1a2e",
              fontSize: 14, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Back
          </button>
          <div style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>
            Step {step + 1} of {visibleSteps.length}
          </div>
          <button
            onClick={() => setStep(Math.min(visibleSteps.length - 1, step + 1))}
            disabled={step === visibleSteps.length - 1}
            style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: step === visibleSteps.length - 1 ? "#9ca3af" : "#2d6a4f",
              color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: step === visibleSteps.length - 1 ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {step === visibleSteps.length - 2 ? "Review →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
