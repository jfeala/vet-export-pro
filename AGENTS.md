# VetExport Pro — Agent Guide

## What Is This?

A web application that simplifies USDA APHIS international health certificates for pet travel. Users answer guided questions about their pet, travel plans, and vaccination history. The app applies regulatory logic and generates a correctly completed PDF certificate ready for vet signature and APHIS endorsement.

**First supported certificate:** EN-ES 2019-1293 (EU non-commercial movement of dogs, cats, ferrets from the U.S.)

**Stack:** Next.js (App Router) + PostgreSQL + Prisma + pdf-lib + NextAuth.js

## Directory Map

| Path | What's There | When to Look |
|------|-------------|--------------|
| `src/app/` | Next.js App Router pages and API routes | Adding pages or endpoints |
| `src/app/api/` | API route handlers | Backend logic, PDF generation |
| `src/components/` | React components | UI changes |
| `src/components/forms/` | Certificate input wizard steps | Adding/modifying form fields |
| `src/components/ui/` | Shared design system components | Buttons, inputs, selects, banners |
| `src/lib/` | Shared utilities and business logic | Domain logic, helpers |
| `src/lib/certificates/` | Certificate type definitions and logic | Adding new certificate types |
| `src/lib/certificates/en-es-2019-1293/` | EU pet certificate — field map, validation, conditional logic | EU certificate changes |
| `src/lib/pdf/` | PDF generation engine | Filling templates, strikethroughs, page numbering |
| `src/lib/validation/` | Zod schemas and cross-field validation rules | Form validation |
| `prisma/` | Database schema and migrations | Schema changes |
| `prisma/schema.prisma` | Prisma schema | Data model |
| `prisma/migrations/` | Migration history | Never edit existing migrations |
| `public/templates/` | Blank official PDF certificate templates | Adding new certificate types |
| `docs/` | Project documentation | Understanding domain and architecture |
| `tests/` | Test suites | Vitest unit/integration tests |

## Tech Stack Rationale

| Choice | Why |
|--------|-----|
| **Next.js (App Router)** | Full-stack React framework. Server Components for the marketing/info pages, client components for the interactive form wizard. API routes co-located. Vercel deployment is trivial. |
| **TypeScript** | The certificate field mappings and conditional logic are complex. Type safety prevents bugs in the form ↔ PDF pipeline. |
| **Prisma + PostgreSQL** | Relational data (users → pets → certificates → PDF outputs). Prisma gives typed queries and easy migrations. Use Neon or Supabase for managed Postgres. |
| **pdf-lib** | Pure JavaScript PDF manipulation. Can open the official blank APHIS template PDFs, overlay text at exact coordinates, and apply visual strikethroughs. Runs server-side in API routes. No native dependencies, deploys anywhere. |
| **NextAuth.js (Auth.js v5)** | Email/password + Google OAuth. Users need accounts to save pet profiles and certificate history. |
| **Zod** | Schema validation for form data. Shared between client (form validation) and server (API input validation). |
| **Tailwind CSS** | Utility-first styling. The form prototype already uses inline styles — migrate to Tailwind classes. |
| **Vercel** | Deploy target. Serverless functions for API routes, edge network for static pages. If PDF generation hits the 10s serverless timeout, move it to a Vercel Function with `maxDuration: 60`. |

## Data Model

```
User
  ├── id, email, name, passwordHash, createdAt
  │
  ├── PetProfile[] (reusable across certificates)
  │     ├── id, userId
  │     ├── species, breed, sex, color, dateOfBirth
  │     ├── identificationSystem, identificationNumber
  │     ├── microchipImplantDate
  │     └── currentRabiesVaccination (JSON — vaccine name, manufacturer, batch, dates)
  │
  └── Certificate[]
        ├── id, userId, certificateType (e.g., "EN-ES-2019-1293")
        ├── status (draft | completed | endorsed)
        ├── formData (JSON — full snapshot of all form inputs)
        ├── pdfUrl (S3/Vercel Blob URL of generated PDF)
        ├── createdAt, updatedAt
        └── CertificatePet[] (join — which pets are on this certificate)
              └── petProfileId, certificateId, tapewormData (JSON, nullable)
```

Key design decisions:
- **PetProfile is a first-class entity.** Users add their pets once, then reuse them across multiple certificates. Rabies vaccination details live on the pet because they're reused and rarely change.
- **formData is a JSON snapshot.** The complete form state is stored as JSON so we can always regenerate the PDF exactly as submitted. This also decouples the form schema from the relational model — when we add new certificate types, we don't need schema migrations for every field.
- **Tapeworm data lives on the join table** because it's certificate-specific (treatment must be 1–5 days before each trip).

## Certificate Type System

Each certificate type is a module in `src/lib/certificates/<certificate-id>/` containing:

```
src/lib/certificates/en-es-2019-1293/
├── index.ts          # Exports: metadata, schema, fieldMap, conditionalLogic, pdfGenerator
├── schema.ts         # Zod schema for this certificate's formData
├── field-map.ts      # Maps form fields → PDF template coordinates and formatting
├── conditions.ts     # Strikethrough logic, conditional section visibility
├── pdf-generator.ts  # Uses pdf-lib to fill the template PDF
└── constants.ts      # EU countries, tapeworm-required destinations, species options, etc.
```

This structure means adding a new certificate type (e.g., an Australia or Japan export cert) is self-contained. The form wizard dynamically renders steps based on the certificate module's schema and field map.

## PDF Generation Architecture

The PDF engine works in three phases:

1. **Field placement** — Overlay text onto the blank template at exact (x, y) coordinates. `field-map.ts` defines these coordinates for every fillable field. Coordinates are measured in PDF points from the bottom-left origin of each page.

2. **Conditional strikethroughs** — Draw lines through non-applicable "either/or" sections and add initials. `conditions.ts` evaluates the form data and returns a list of `{ page, startY, endY, initials }` strikethrough instructions.

3. **Page numbering and assembly** — Number every page in "Page X of Y" format. Attach Declaration pages (numbered separately). Output the final assembled PDF.

The blank template PDF lives in `public/templates/en-es-2019-1293.pdf`. **Never modify this file** — it's the official APHIS form. All content is overlaid programmatically.

### Developing the Field Map

The most tedious but critical task is mapping field coordinates. Process:

1. Open the blank template in a PDF viewer that shows coordinates (Adobe Acrobat, or use `pdf-lib` to iterate through form fields if the PDF has them)
2. For each field, record: `{ page: number, x: number, y: number, fontSize: number, maxWidth?: number }`
3. Dates must be formatted to dd/mm/yyyy before placement
4. Test by generating a PDF with sample data and visually comparing against the APHIS instructions PDF (`example instructions.pdf`)

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (local or Docker)
- pnpm

### Setup

```bash
pnpm install
cp .env.example .env.local          # Configure DATABASE_URL, NEXTAUTH_SECRET, etc.
pnpm prisma migrate dev             # Run migrations
pnpm prisma db seed                 # Seed test data (sample users, pets, certificates)
pnpm dev                            # Start Next.js dev server on localhost:3000
```

### Environment Variables

```
DATABASE_URL=postgresql://vetexport:vetexport@localhost:5432/vetexport
NEXTAUTH_SECRET=<random-string>
NEXTAUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>   # For PDF storage; use local filesystem in dev
```

## Development Workflow

### 1. Understand the domain first

Before writing code, read these files:

| File | What You'll Learn |
|------|------------------|
| `README.md` | Project overview, problem statement, architecture |
| `CERTIFICATE-FIELD-MAP.md` | Every field on the certificate, where data comes from, formatting rules, conditional logic |
| `example instructions.pdf` | APHIS's own instructions with red annotations — the source of truth |
| `example health certificate.pdf` | The blank certificate you're filling |

The CERTIFICATE-FIELD-MAP.md is the **spec**. If you're adding a form field, modifying validation, or touching PDF generation, that file tells you exactly what the certificate requires.

### 2. Develop

```bash
pnpm dev                  # Dev server with hot reload
pnpm lint                 # ESLint
pnpm typecheck            # TypeScript strict mode
```

### 3. Test

```bash
pnpm test                 # Run all tests
pnpm test:unit            # Unit tests (validation, conditional logic, date formatting)
pnpm test:pdf             # PDF generation tests (snapshot comparison)
```

**PDF generation tests** work by generating a PDF from known test data and comparing it against a golden snapshot. If the output changes, visually review the new PDF before updating the snapshot.

### 4. Commit

```bash
git checkout -b feat/my-change
git add <files>
git commit -m "feat: add tapeworm treatment step to form wizard"
pnpm lint && pnpm typecheck && pnpm test   # Must pass before pushing
git push -u origin feat/my-change
```

Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.

## Key Implementation Notes

### Date Handling

All dates are stored internally as ISO strings (`YYYY-MM-DD`) from HTML date inputs. They are **only** converted to `dd/mm/yyyy` at two points:
1. Display in the Review step of the form
2. PDF text overlay in the generator

Use the shared `formatDateEU(isoDate: string): string` helper in `src/lib/dates.ts`. Never format dates inline.

### Microchip Number Consistency

The microchip number (`identificationNumber`) appears in 4+ places on the certificate. The PDF generator should read it from one source (the pet profile) and place it everywhere. Never allow the user to enter it separately for different sections.

### Strikethrough Convention

On the official certificate, non-applicable options are struck through with a line and initialed by the signing veterinarian. In the PDF generator:
- Draw a horizontal line (1pt weight, black) through the center of each struck line of text
- The vet initials are added by hand after printing — do not generate them

### Conditional Logic Priority

The `conditions.ts` module evaluates form data and returns which certificate sections to keep vs. strike. The logic is based on:

1. **Traveler type** (owner / authorized person / carrier) → Section II.1 options
2. **Pet count** (≤5 or >5 with competition) → Section II.2
3. **Pet age + vaccination status** → Section II.3 branching (young pet vs. standard)
4. **Country of origin** (always U.S. = Annex II listed) → II.3.1 sub-options (always keep "listed country", always strike "titer test")
5. **Destination + species** → Section II.4 tapeworm treatment
6. **Vet type** (accredited vs. military) → Signature block header

When adding new certificate types, follow this same pattern: define all conditional branches as pure functions of form data.

## Style Guidelines

- TypeScript strict mode — no `any`, no type assertions unless absolutely necessary
- Prefer server components; use `"use client"` only for interactive form steps
- Zod schemas are the single source of truth for form data shape
- Keep certificate modules self-contained — no cross-certificate imports
- Components should be small and composable; the form wizard steps should each be <200 lines
- Use Tailwind utility classes; no custom CSS files except for PDF-specific styles
- All user-facing text related to the certificate should reference the official APHIS language (don't paraphrase regulatory requirements)

## Common Tasks

### Add a new form field

1. Add the field to the Zod schema in `src/lib/certificates/en-es-2019-1293/schema.ts`
2. Add the input to the appropriate wizard step in `src/components/forms/`
3. Map the field to PDF coordinates in `field-map.ts`
4. If conditional, add logic to `conditions.ts`
5. Update `CERTIFICATE-FIELD-MAP.md`
6. Add a test case

### Add a new certificate type

1. Create `src/lib/certificates/<new-cert-id>/` with the standard module structure
2. Add the blank PDF template to `public/templates/`
3. Add APHIS instructions PDF and annotated field map to `docs/`
4. Define the Zod schema, field map, conditions, and PDF generator
5. Register the certificate type in `src/lib/certificates/index.ts`
6. The form wizard should dynamically render based on the schema

### Fix a PDF layout issue

1. Open the generated PDF and the blank template side by side
2. Identify which field is misaligned — check `field-map.ts` for its coordinates
3. Adjust x/y values (PDF coordinates are in points, 72 points = 1 inch, origin is bottom-left)
4. Regenerate and compare. Repeat until aligned.
5. Update the PDF snapshot test

## Deployment

Target: **Vercel**

```bash
vercel                      # Preview deployment
vercel --prod               # Production deployment
```

- PostgreSQL: Neon (serverless Postgres, integrates with Vercel)
- PDF storage: Vercel Blob (or S3 if preferred)
- Auth: NextAuth.js handles sessions via JWT

Environment variables are configured in the Vercel dashboard. The `DATABASE_URL` uses Neon's pooled connection string for serverless compatibility.

If PDF generation exceeds Vercel's default 10s function timeout, configure the API route:
```typescript
export const maxDuration = 60; // seconds
```
