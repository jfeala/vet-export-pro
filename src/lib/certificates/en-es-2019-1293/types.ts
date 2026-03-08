export interface Pet {
  id: number;
  species: string;
  sex: string;
  color: string;
  breed: string;
  identificationNumber: string;
  identificationSystem: string;
  dateOfBirth: string;
  microchipImplantDate: string;
  youngPetStatus?: string;
  rabiesVaccinationDate: string;
  rabiesVaccineName: string;
  rabiesVaccineManufacturer: string;
  rabiesBatchNumber: string;
  rabiesValidFrom: string;
  rabiesValidTo: string;
  tapewormProductName: string;
  tapewormManufacturer: string;
  tapewormTreatmentDate: string;
  tapewormTreatmentTime: string;
  tapewormVetName: string;
}

export interface CertificateFormData {
  travelingPerson: string;
  carrierName: string;
  ownerNameUS: string;
  ownerPhoneUS: string;
  ownerAddressUS: string;
  ownerNameEU: string;
  ownerPhoneEU: string;
  ownerAddressEU: string;
  ownerPostalCodeEU: string;
  destinationCountry: string;
  departureDate: string;
  transportMeans: string;
  placeOfLoading: string;
  entryBIP: string;
  placeOfDestination: string;
  pets: Pet[];
  competitionDetails: string;
  vetType: string;
  vetName: string;
  vetTitle: string;
  vetAddress: string;
  vetPhone: string;
  vetSignDate: string;
  submissionMethod: string;
}

export function emptyPet(): Pet {
  return {
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
  };
}

export function initialFormData(): CertificateFormData {
  return {
    travelingPerson: "",
    carrierName: "",
    ownerNameUS: "",
    ownerPhoneUS: "",
    ownerAddressUS: "",
    ownerNameEU: "",
    ownerPhoneEU: "",
    ownerAddressEU: "",
    ownerPostalCodeEU: "",
    destinationCountry: "",
    departureDate: "",
    transportMeans: "",
    placeOfLoading: "",
    entryBIP: "",
    placeOfDestination: "",
    pets: [emptyPet()],
    competitionDetails: "",
    vetType: "",
    vetName: "",
    vetTitle: "",
    vetAddress: "",
    vetPhone: "",
    vetSignDate: "",
    submissionMethod: "",
  };
}
