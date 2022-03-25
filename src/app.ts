// Import node modules
import { getLogger } from 'log4js';
// Logger initialise
const logger = getLogger();
logger.level = '' + 'debug';


//================================================ Declaration of Object and Dictionary ================================================//

const objApartment = {
  2: {
    noOfbhk: 2,
    noOfPeople: 3,
    consumptionPerMonthInLitres: 900,
  },
  3: {
    noOfbhk: 3,
    noOfPeople: 5,
    consumptionPerMonthInLitres: 1500,
  },
};

const dictWaterCostPerLitre = {
  Corporation: 1,
  Borewell: 1.5,
};

const slabs = [
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
];

function getTankerSlabCostPerLitre(litres:number) {
  logger.debug(`getTankerSlabCostPerLitre for Litres: ${litres}`);

  let bill = 0;
  let prevSlabLimit = 0;

  slabs.forEach((slab) => {
    let slabDiff = slab.slabLimit - prevSlabLimit;
    let slabRate = slab.costPetLitres;

    if (litres > slabDiff) {
      litres -= slabDiff;
      bill += slabDiff * slabRate;
    } else {
      bill += litres * slabRate;
      litres = 0;
    }

    prevSlabLimit = slab.slabLimit;
  });

  return bill;
}

//================================================ Declaration of Object and Dictionary ================================================//

const keysOfObjApartment = Object.keys(objApartment);

//Input Variable
const selectedApartment = 3;
const selectedRatio = '1:5';
const selectedGuest = 10;

// Calc of Ratio
const arr = selectedRatio.split(':');
const numCorporation = +arr[0];
const numBorewell = +arr[1];

const valBorewell = numBorewell / (numBorewell + numCorporation);
const valCorporation = numCorporation / (numBorewell + numCorporation);
// Calc of Ratio

// To check Apartment input is valid
const hasSelectedApartment = keysOfObjApartment.find(
  (item) => item == '' + selectedApartment
);
const isSelectedApartmentValid = hasSelectedApartment ? true : false;
// To check Apartment input is valid

let errorMessage = '';
let isError = false;

let calcTotalWaterConsumedInLitres = 0;
let calcTotalCost = 0;

if (!isSelectedApartmentValid) {
  errorMessage = 'Invalid apartment selected';
  isError = true;
} else {
  calcTotalWaterConsumedInLitres =
    objApartment[selectedApartment].consumptionPerMonthInLitres;

  calcTotalCost =
    calcTotalWaterConsumedInLitres *
      valCorporation *
      dictWaterCostPerLitre['Corporation'] +
    calcTotalWaterConsumedInLitres *
      valBorewell *
      dictWaterCostPerLitre['Borewell'];

  // To calc TotalWaterConsumedInLitres w/o Guest
  logger.info(
    `calcTotalWaterConsumedInLitres  w/o Guest: ${calcTotalWaterConsumedInLitres}`
  );
  // To calc TotalWaterConsumedInLitres w/o Guest
  logger.info(`calcTotalCost  w/o Guest: ${calcTotalCost}`);

  // To calc Guest consumption
  let calcGuestConsumption = selectedGuest * 10 * 30;
  const calcGuestCost = getTankerSlabCostPerLitre(calcGuestConsumption);

  logger.info(`calcGuestConsumption: ${calcGuestConsumption}`);

  logger.info(`calcGuestCost: ${calcGuestCost}`);

  calcTotalWaterConsumedInLitres =
    calcTotalWaterConsumedInLitres + calcGuestConsumption;

  calcTotalCost = calcTotalCost + calcGuestCost;
}

const totalWaterConsumedInLitres = calcTotalWaterConsumedInLitres;
const totalCost = calcTotalCost;

if (isError) {
  logger.error(`ERROR : ${errorMessage}`);
} else {
  logger.warn(`TOTAL_WATER_CONSUMED_IN_LITERS : ${totalWaterConsumedInLitres}`);
  logger.warn(`TOTAL_COST : ${totalCost}`);
}
