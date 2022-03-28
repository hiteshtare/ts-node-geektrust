export const APP_CONFIG = {
  loggerLevel: 'debug',
  //Constants
  arrApartmentType: [{
    noOfbhk: 2,
    noOfPeople: 3,
    consumptionPerMonthInLitres: 900,
  },
  {
    noOfbhk: 3,
    noOfPeople: 5,
    consumptionPerMonthInLitres: 1500,
  }],
  objWaterType: {
    Corporation: 1,
    Borewell: 1.5,
  },
  arrSlabRates: [
    {
      slabLimit: 500,
      costPetLitres: 2,
    },
    {
      slabLimit: 1500,
      costPetLitres: 3,
    },
    {
      slabLimit: 3000,
      costPetLitres: 5,
    },
  ]
}