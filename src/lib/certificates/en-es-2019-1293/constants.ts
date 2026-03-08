export const COUNTRIES_EU = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "GB-ENG", name: "England (UK)" },
  { code: "GB-NIR", name: "Northern Ireland (UK)" },
  { code: "GB-SCT", name: "Scotland (UK)" },
  { code: "GB-WLS", name: "Wales (UK)" },
  { code: "NO", name: "Norway" },
] as const;

export type CountryCode = (typeof COUNTRIES_EU)[number]["code"];

export const TAPEWORM_REQUIRED: readonly string[] = [
  "FI",
  "IE",
  "MT",
  "NO",
  "GB-ENG",
  "GB-NIR",
  "GB-SCT",
  "GB-WLS",
];

export const SPECIES_OPTIONS = [
  { value: "Canis familiaris", label: "Dog" },
  { value: "Felis catus", label: "Cat" },
  { value: "Mustela putorius furo", label: "Ferret" },
] as const;

export const SEX_OPTIONS = [
  "Female",
  "Male",
  "Spayed female",
  "Neutered male",
] as const;

export const ID_SYSTEM_OPTIONS = ["Transponder", "Tattoo"] as const;

export const STEPS = [
  { id: "owner", label: "Owner Info", icon: "1" },
  { id: "destination", label: "Travel Details", icon: "2" },
  { id: "pets", label: "Pet Details", icon: "3" },
  { id: "rabies", label: "Rabies Vaccine", icon: "4" },
  { id: "tapeworm", label: "Tapeworm Tx", icon: "5" },
  { id: "vet", label: "Veterinarian", icon: "6" },
  { id: "review", label: "Review", icon: "7" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
