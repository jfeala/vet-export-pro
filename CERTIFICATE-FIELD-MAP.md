# Certificate Field Map: EN-ES 2019-1293

This document maps every field in the EU pet travel health certificate to its data source in the web form, along with regulatory notes and PDF generation instructions.

Reference documents:
- `example health certificate.pdf` — The blank official certificate
- `example instructions.pdf` — APHIS completion instructions (red annotation text)

---

## Part I: Details of Dispatched Consignment (Page 1)

| Box | Certificate Label | Form Source | PDF Notes |
|-----|------------------|-------------|-----------|
| I.1 | Consignor — Name | `ownerNameUS` | Owner or designated person's name |
| I.1 | Consignor — Address | `ownerAddressUS` | U.S. address |
| I.1 | Consignor — Tel | `ownerPhoneUS` | U.S. phone |
| I.2 | Certificate reference No | *Assigned by APHIS/Military vet at endorsement* | Leave blank for user; filled by APHIS |
| I.2.a | *(sub-field)* | — | Leave blank |
| I.3 | Central competent authority | *Static* | Always: "USDA, APHIS, Veterinary Services" |
| I.4 | Local competent authority | *Assigned by APHIS* | Format: "VS-___" — filled by APHIS or Military vet |
| I.5 | Consignee — Name | `ownerNameEU` | Name at EU destination |
| I.5 | Consignee — Address | `ownerAddressEU` | Must include EU country name |
| I.5 | Consignee — Postal code | `ownerPostalCodeEU` | |
| I.5 | Consignee — Tel | `ownerPhoneEU` | |
| I.6 | Person responsible in EU | — | Leave blank (has diagonal line-out) |
| I.7 | Country of origin | *Static* | Always: "United States" |
| I.7 | ISO code | *Static* | Always: "US" |
| I.8 | Region of origin | — | Leave blank |
| I.9 | Country of destination | `destinationCountry` → country name | Lookup from `COUNTRIES_EU` |
| I.9 | ISO code | `destinationCountry` → code | |
| I.10 | Region of destination | — | Leave blank |
| I.11 | Place of origin | — | Leave blank |
| I.12 | Place of destination | `placeOfDestination` | |
| I.13 | Place of loading | `placeOfLoading` | Airport/port name |
| I.14 | Date of departure | `departureDate` | **Must convert to dd/mm/yyyy** |
| I.15 | Means of transport | `transportMeans` | "Aeroplane", "Ship", etc. |
| I.16 | Entry BIP in EU | `entryBIP` | Travellers' Point of Entry |
| I.17 | CITES numbers | — | Leave blank (pets are not CITES-listed) |
| I.18 | Description of commodity | Derived from `pets[].species` | Check the box(es): Dog ☐ Cat ☐ Ferret ☐ |
| I.19 | Commodity code (HS code) | *Static* | Always: "010619" |
| I.20 | Quantity | `pets.length` | Number of animals |
| I.21 | Temperature of products | — | Leave blank (not applicable) |
| I.22 | Total number of packages | — | Leave blank |
| I.23 | Seal/Container No | — | Leave blank |
| I.24 | Type of packaging | — | Leave blank |
| I.25 | Commodities certified for | *Static* | Always check: "Pets ☐" |
| I.26 | For transit to 3rd country | — | Leave blank |
| I.27 | For import or admission into EU | — | Leave blank |

## Box I.28: Identification of the Commodities (Page 1–2)

One row per animal. Each column maps as follows:

| Column | Form Source | Notes |
|--------|-----------|-------|
| Species (scientific name) | `pets[i].species` | Must use scientific name: "Canis familiaris", "Felis catus", or "Mustela putorius furo" |
| Sex | `pets[i].sex` | "Female", "Male", "Spayed female", or "Neutered male" |
| Colour | `pets[i].color` | Free text, as described by owner |
| Breed | `pets[i].breed` | Free text, as stated by owner |
| Identification number | `pets[i].identificationNumber` | Microchip or tattoo alphanumeric code. **THIS IS THE PRIMARY KEY** — must match exactly in all other tables |
| Identification system | `pets[i].identificationSystem` | "Transponder" or "Tattoo" |
| Date of birth | `pets[i].dateOfBirth` | **dd/mm/yyyy** — as stated by owner |

---

## Part II: Certification — Health Information (Pages 2–6)

### Section II.1: Purpose/Nature of Journey

**Conditional logic — strike through non-applicable options:**

| Condition | Form Source | Action on Certificate |
|-----------|-----------|----------------------|
| Owner is traveling | `travelingPerson === "owner"` | Keep "the owner", strike through the other two options |
| Authorized person | `travelingPerson === "authorized"` | Keep "natural person who has authorisation...", strike others |
| Carrier | `travelingPerson === "carrier"` | Keep "natural person designated by a carrier...", strike others. Insert `carrierName` |

### Section II.2: Number of Animals

| Condition | Form Source | Action |
|-----------|-----------|--------|
| 5 or fewer pets | `pets.length <= 5` | Keep "moved in a number of five or less", strike the >5 option |
| More than 5 pets | `pets.length > 5` | Keep the >5 option (must be 6+ months, competition/exhibition). Strike "five or less". Also resolve "to attend such event" vs "with an association" |

### Section II.3: Rabies Vaccination Attestation

This is the most complex conditional section. The certificate has two main branches:

**Branch A — Young/unvaccinated pets** (`either [II.3.` — first option):
- Applies when: pet is <12 weeks and unvaccinated, OR 12–16 weeks and <21 days since primary vaccination
- Form source: `pets[i].youngPetStatus` being `under12_unvaccinated` or `12to16_vaccinated_waiting`
- Additional requirement: destination country must allow it (not all do)
- Requires Declaration #2 OR proof of traveling with vaccinated mother

**Branch B — Standard vaccinated pets** (`or/and [II.3.` — second option):
- Applies when: pet was ≥12 weeks at vaccination AND ≥21 days have elapsed since primary vaccination
- This is the most common path

**Within Branch B, sub-option II.3.1:**

| Sub-option | Condition | Action |
|------------|-----------|--------|
| Listed country (first `either`) | Always true for U.S. departures | **Keep this option**. The U.S. is in Annex II. Strike through the titer test option below |
| Non-listed country + titer test (`or`) | Never applies for U.S. | **Always strike through** for U.S.-origin pets |

### Rabies Vaccination Table (Page 3)

One row per animal:

| Column | Form Source | Notes |
|--------|-----------|-------|
| Alphanumeric code of the animal | `pets[i].identificationNumber` | Must match I.28 |
| Date of implantation and/or reading | `pets[i].microchipImplantDate` | **dd/mm/yyyy**. Must be ≤ rabies vaccination date |
| Date of vaccination | `pets[i].rabiesVaccinationDate` | **dd/mm/yyyy**. Must be ≥ microchip date |
| Name and manufacturer of vaccine | `pets[i].rabiesVaccineName` + `pets[i].rabiesVaccineManufacturer` | Both required; combine into one cell |
| Batch number | `pets[i].rabiesBatchNumber` | From vaccine vial |
| Validity From | `pets[i].rabiesValidFrom` | **dd/mm/yyyy** |
| Validity To | `pets[i].rabiesValidTo` | **dd/mm/yyyy**. 1 or 3 years per manufacturer |
| Date of blood sampling | — | **Leave blank** — not required for U.S.-origin pets |

### Section II.4: Anti-Parasite (Tapeworm) Treatment (Page 4)

| Condition | Form Source | Action |
|-----------|-----------|--------|
| Dogs going to UK/IE/FI/MT/NO | `destinationCountry` in `TAPEWORM_REQUIRED` AND species is dog | Keep "have been treated", strike "have not been treated". Fill the table |
| All other cases | — | Keep "have not been treated", strike "have been treated". **Do NOT strike the table** (EU vet may use it later) |

**Tapeworm Treatment Table** (only filled when treatment is required):

| Column | Form Source | Notes |
|--------|-----------|-------|
| Transponder or tattoo number | `pets[i].identificationNumber` | Must match I.28 |
| Name and manufacturer of product | `pets[i].tapewormProductName` + `pets[i].tapewormManufacturer` | Must contain praziquantel or be effective against E. multilocularis. Norway requires praziquantel or epsiprantel specifically |
| Date and time of treatment | `pets[i].tapewormTreatmentDate` + `pets[i].tapewormTreatmentTime` | **dd/mm/yyyy** and **HH:MM** (24h). Must be 24–120 hours before scheduled EU arrival |
| Administering veterinarian | `pets[i].tapewormVetName` | Name in CAPITALS, plus signature and optional stamp. Must be a USDA Accredited Vet. Cannot sign until after treatment is administered |

---

## Signature Blocks (Page 6)

### Official/Authorised Veterinarian Block

| Field | Form Source | Notes |
|-------|-----------|-------|
| Name (in capital letters) | `vetName` | |
| Qualification and title | `vetTitle` | |
| Address | `vetAddress` | |
| Telephone | `vetPhone` | |
| Date | `vetSignDate` | **dd/mm/yyyy** |
| Signature | — | Wet signature in blue ink, or "Electronically Signed" if via VEHCS |
| Stamp | — | Required for Military Vets only |

**Strike-through logic:**
- If `vetType === "accredited"`: strike through "Official veterinarian" in the header
- If `vetType === "military"`: strike through "Authorised veterinarian" in the header

### Endorsement Block (APHIS)

Leave entirely blank. APHIS fills this at endorsement. Not required if Military Vet signed.

### Official at Travellers' Point of Entry Block

Leave entirely blank. EU officials fill this at arrival.

---

## Declaration #1 (Separate page — always required)

Page numbered independently: "Page 1 of 1"

| Field | Form Source | Notes |
|-------|-----------|-------|
| Undersigned name | `ownerNameUS` (or authorized person name) | Print name |
| Owner/natural person designation | `travelingPerson` | Strike through non-applicable options. Must match the choice in II.1 |
| Transponder/tattoo code | `pets[i].identificationNumber` | One row per pet |
| Animal health certificate number | *Assigned by APHIS* | Filled after endorsement |
| Responsibility clause | `travelingPerson` | Strike through non-applicable. Must match II.1 |
| Place and date | City/state + date signed | **dd/mm/yyyy** |
| Signature | — | Owner or authorized person signs. NOT endorsed by APHIS |

## Declaration #2 (Separate page — conditional)

**Only required when:** Pet is <12 weeks unvaccinated, or 12–16 weeks and <21 days since primary rabies vaccination, AND the destination country allows entry of such animals.

Page numbered independently: "Page 1 of 1"

| Field | Form Source | Notes |
|-------|-----------|-------|
| Undersigned name | `ownerNameUS` | In block letters |
| Transponder/tattoo code | `pets[i].identificationNumber` | |
| Certificate number | *Assigned by APHIS* | |
| Place and date | City/state + date | **dd/mm/yyyy** |
| Signature | — | NOT endorsed by APHIS |

---

## Page Numbering Rules

Every page of the health certificate must have page numbers in "Page X of Y" format.

- The health certificate pages are numbered sequentially (Page 1 of N through Page N of N)
- Declaration #1 is numbered separately: "Page 1 of 1"
- Declaration #2 (if present) is numbered separately: "Page 1 of 1"

The total page count (Y) for the main certificate depends on how many animals are listed (the I.28 table and rabies/tapeworm tables may overflow to additional pages).

---

## Validation Rules (Pre-submission)

These should be enforced in the form before allowing PDF generation:

| Rule | Description |
|------|-------------|
| Microchip date ≤ Rabies date | Microchip must be implanted/read before or on the same day as vaccination |
| 21-day wait (standard path) | `departureDate` minus `rabiesVaccinationDate` must be ≥ 21 days for primary vaccination |
| Tapeworm 1–5 day window | `tapewormTreatmentDate` must be 1–5 days (24–120 hours) before scheduled EU arrival |
| Rabies validity | `rabiesValidTo` must be on or after `departureDate` |
| Pet count ≤ 5 | Unless competition/exhibition documentation is provided and all pets are >6 months |
| Microchip consistency | `identificationNumber` must be identical everywhere it appears |
| Date format | All dates must be convertible to dd/mm/yyyy for the PDF output |
| Certificate validity | APHIS endorsement must occur within 10 days of EU arrival (informational warning) |
| Vet sign window | Accredited vet can sign up to 30 days before export (informational) |
