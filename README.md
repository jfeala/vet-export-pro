# VetExport Pro

A web application that simplifies the completion of USDA APHIS international health certificates for live animal export. The first supported certificate is **EN-ES 2019-1293** — the EU pet travel certificate for non-commercial movement of dogs, cats, and ferrets.

## The Problem

International health certificates issued through USDA APHIS are notoriously difficult to complete:

- Multi-page bilingual PDF forms (English/Spanish for the EU certificate) with dense regulatory language
- Complex conditional logic — sections must be struck through and initialed based on the animal's age, destination country, vaccination status, etc.
- Strict formatting requirements (dd/mm/yyyy dates, page numbering on every page, specific strikethrough conventions)
- Information must be perfectly consistent across multiple sections (e.g., microchip number appears in Box I.28, the rabies table in II.3.1, the tapeworm table in II.4, and both Declarations)
- Veterinarians and pet owners routinely make errors that cause certificates to be rejected at the border or by APHIS endorsement offices

## The Solution

VetExport Pro presents a guided, step-by-step web form that:

1. Collects all required information in plain language with contextual help
2. Applies domain-specific conditional logic automatically (e.g., tapeworm treatment is only required for dogs going to UK/Ireland/Finland/Malta/Norway)
3. Validates data consistency and regulatory requirements before submission
4. Generates a correctly completed PDF that is ready for vet signature and APHIS endorsement

## Project Structure

```
vet-export-pro/
├── README.md                          # This file
├── CERTIFICATE-FIELD-MAP.md           # Maps every form field → PDF field with regulatory notes
├── pet-travel-form.jsx                # React prototype of the input wizard (7-step form)
├── example health certificate.pdf     # Blank EN-ES 2019-1293 certificate (the output template)
└── example instructions.pdf           # APHIS instructions for completing the certificate (red annotations)
```

## Architecture Overview

### Frontend (React)
- Multi-step wizard form (`pet-travel-form.jsx` is the working prototype)
- Conditional rendering based on species, destination, pet age, and vet type
- Client-side validation before submission
- Saved drafts / returning user support (pet profiles reusable across certificates)

### Backend (to be built)
- API to receive form submissions and persist data
- PDF generation engine that fills the blank EN-ES 2019-1293 template
- User accounts with saved pet profiles and certificate history
- (Future) Integration with VEHCS for electronic submission

### PDF Generation
The core technical challenge. The generator must:
- Fill form fields in the correct locations on the official PDF template
- Apply strikethroughs with initials to non-applicable conditional sections (the "either/or" blocks)
- Insert page numbers on every page in "Page X of Y" format
- Populate the rabies vaccination table and tapeworm treatment table
- Generate the Declaration #1 page (always required) and Declaration #2 page (only for young unvaccinated pets)
- Ensure all dates are output in dd/mm/yyyy format regardless of how they were input

Recommended approach: Use `pdf-lib` (JavaScript) or `PyPDF2`/`reportlab` (Python) to overlay text onto the official blank PDF template.

## Key Domain Concepts

A developer working on this project should understand:

- **USDA Accredited Veterinarian vs. Military Veterinarian**: Two types of vets can sign. This affects which title gets struck through and whether APHIS endorsement is needed.
- **APHIS Endorsement**: The government counter-signature. Must happen within 10 days of EU arrival. The accredited vet can sign up to 30 days before export.
- **Annex II listed countries**: The U.S. is on this list, which means rabies antibody titer testing is NOT required. This simplifies the certificate significantly.
- **Echinococcus (tapeworm) treatment**: Only applies to dogs, and only for certain destinations (UK, Ireland, Finland, Malta, Norway). Must be administered by a vet (not the owner) 1–5 days before arrival.
- **Declaration #1**: Required for ALL certificates. Signed by the owner or authorized person, NOT endorsed by APHIS.
- **Declaration #2**: Only required for young pets (under 12 weeks unvaccinated, or 12–16 weeks with fewer than 21 days since primary vaccination). Not all EU countries accept this.
- **The microchip number is the primary key**: It must match exactly across Box I.28, the rabies table, the tapeworm table, and both Declarations.

## Getting Started

1. Review the two reference PDFs to understand the certificate format and APHIS instructions
2. Read `CERTIFICATE-FIELD-MAP.md` for the complete field-by-field mapping
3. The `pet-travel-form.jsx` prototype can be dropped into any React environment — it's a single self-contained component with no external dependencies beyond React and two Google Fonts

## Future Scope

- Additional certificate types (there are hundreds of APHIS certificates for different species/destinations)
- Multi-pet batch processing for breeders and rescue organizations
- Vet-facing workflow (vet receives a pre-filled certificate from the pet owner, reviews and signs)
- APHIS office locator and appointment scheduling
- Airline pet policy integration (carrier requirements layered on top of government requirements)
