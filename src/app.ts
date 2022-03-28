import { APP_CONFIG } from './config/index';
// Import node modules
import { getLogger } from 'log4js';
import { readFileSync } from 'fs';

try {

  // Logger initialise
  const logger = getLogger();
  logger.level = '' + 'debug';

  //Input Variable
  // const selectedApartment = 2;
  // const selectedRatio = '3:7';
  // const selectedGuest = 5;

  let selectedApartment = 0;
  let selectedRatio = '';
  let selectedGuest = 0;

  let isAllotWater = false;
  let isBill = false;

  //==== Reading file contents ====//

  const data = readFileSync('assets/input1.txt', 'utf8');
  logger.warn(`Read File`);

  data.split(/\r?\n/).forEach((line: any) => {
    // logger.info(`Line from file: ${line}`);

    const arrStr: string = line.split(' ');
    logger.debug(arrStr);

    if (arrStr) {
      const command = arrStr[0].toLocaleUpperCase();
      logger.debug(`command: ${command}`);

      switch (command) {

        case 'ALLOT_WATER':
          const apartmentType = +arrStr[1];
          const ratio = arrStr[2];
          logger.debug(`apartmentType: ${apartmentType}`);
          logger.debug(`ratio: ${ratio}`);

          selectedApartment = apartmentType ? apartmentType : 2;
          selectedRatio = ratio ? ratio : '3:7';

          isAllotWater = true;
          break;

        case 'ADD_GUESTS':
          const guestsCount = +arrStr[1];
          logger.debug(`guestsCount: ${guestsCount}`);

          selectedGuest = selectedGuest + guestsCount;

          break;

        case 'BILL':

          isBill = true;
          break;

        default: break;
      }

    }

    logger.warn(`selectedApartment:${selectedApartment}`);
    logger.warn(`selectedRatio:${selectedRatio}`);
    logger.warn(`selectedGuest:${selectedGuest}`);
  });



  //==== Reading file contents ====//

  //==== Declaration of Constants and Functions ====//
  function getTankerSlabCostPerLitre(litres: number) {
    logger.debug(`getTankerSlabCostPerLitre for Litres: ${litres}`);

    let bill = 0;
    let prevSlabLimit = 0;

    APP_CONFIG.arrSlabRates.forEach((slab) => {
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

  //==== Declaration of Constants and Functions ====//

  // Calc of Ratio
  const arr = selectedRatio.split(':');
  const numCorporation = +arr[0];
  const numBorewell = +arr[1];

  const valBorewell = numBorewell / (numBorewell + numCorporation);
  const valCorporation = numCorporation / (numBorewell + numCorporation);
  // Calc of Ratio

  // To check Apartment input is valid
  const hasSelectedApartment = APP_CONFIG.arrApartmentType.filter(obj => {
    return obj.noOfbhk === selectedApartment
  })

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

    calcTotalWaterConsumedInLitres = hasSelectedApartment[0].consumptionPerMonthInLitres;

    calcTotalCost =
      calcTotalWaterConsumedInLitres *
      valCorporation *
      APP_CONFIG.objWaterType['Corporation'] +
      calcTotalWaterConsumedInLitres *
      valBorewell *
      APP_CONFIG.objWaterType['Borewell'];

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


}
catch (err) {
  console.error(err)
}
