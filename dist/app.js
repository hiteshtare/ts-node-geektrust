"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./config/index");
const common_util_1 = require("./util/common.util");
const _logger = (0, common_util_1.getLoggerLevel)();
let selectedApartment = 0;
let selectedRatio = '';
let selectedGuest = 0;
let isAllotWater = false;
let isBill = false;
const filename = process.argv[2];
const result = (0, common_util_1.readInputFile)(filename);
if (!result.isError && result.data) {
    result.data.split(/\r?\n/).forEach((line) => {
        const arrStr = line.split(' ');
        _logger.debug(arrStr);
        if (arrStr) {
            const command = arrStr[0].toLocaleUpperCase();
            _logger.debug(`command: ${command}`);
            switch (command) {
                case 'ALLOT_WATER':
                    const apartmentType = +arrStr[1];
                    const ratio = arrStr[2];
                    _logger.debug(`apartmentType: ${apartmentType}`);
                    _logger.debug(`ratio: ${ratio}`);
                    selectedApartment = apartmentType ? apartmentType : 2;
                    selectedRatio = ratio ? ratio : '3:7';
                    isAllotWater = true;
                    break;
                case 'ADD_GUESTS':
                    const guestsCount = +arrStr[1];
                    _logger.debug(`guestsCount: ${guestsCount}`);
                    selectedGuest = selectedGuest + guestsCount;
                    break;
                case 'BILL':
                    isBill = true;
                    break;
                default: break;
            }
        }
        _logger.warn(`selectedApartment:${selectedApartment}`);
        _logger.warn(`selectedRatio:${selectedRatio}`);
        _logger.warn(`selectedGuest:${selectedGuest}`);
    });
    if (isAllotWater && isBill) {
        const arr = selectedRatio.split(':');
        const numCorporation = +arr[0];
        const numBorewell = +arr[1];
        const valBorewell = numBorewell / (numBorewell + numCorporation);
        const valCorporation = numCorporation / (numBorewell + numCorporation);
        const hasSelectedApartment = index_1.APP_CONFIG.arrApartmentType.filter(obj => {
            return obj.noOfbhk === selectedApartment;
        });
        const isSelectedApartmentValid = hasSelectedApartment ? true : false;
        let errorMessage = '';
        let isError = false;
        let calcTotalWaterConsumedInLitres = 0;
        let calcTotalCost = 0;
        if (!isSelectedApartmentValid) {
            errorMessage = 'Invalid apartment selected';
            isError = true;
        }
        else {
            calcTotalWaterConsumedInLitres = hasSelectedApartment[0].consumptionPerMonthInLitres;
            calcTotalCost =
                calcTotalWaterConsumedInLitres *
                    valCorporation *
                    index_1.APP_CONFIG.objWaterType['Corporation'] +
                    calcTotalWaterConsumedInLitres *
                        valBorewell *
                        index_1.APP_CONFIG.objWaterType['Borewell'];
            _logger.info(`calcTotalWaterConsumedInLitres  w/o Guest: ${calcTotalWaterConsumedInLitres}`);
            _logger.info(`calcTotalCost  w/o Guest: ${calcTotalCost}`);
            let calcGuestConsumption = selectedGuest * 10 * 30;
            const calcGuestCost = (0, common_util_1.getBillBySlabCostPerLitre)(calcGuestConsumption);
            _logger.info(`calcGuestConsumption: ${calcGuestConsumption}`);
            _logger.info(`calcGuestCost: ${calcGuestCost}`);
            calcTotalWaterConsumedInLitres =
                calcTotalWaterConsumedInLitres + calcGuestConsumption;
            calcTotalCost = calcTotalCost + calcGuestCost;
        }
        const totalWaterConsumedInLitres = calcTotalWaterConsumedInLitres;
        const totalCost = calcTotalCost;
        if (isError) {
            _logger.error(`ERROR : ${errorMessage}`);
        }
        else {
            _logger.warn(`TOTAL_WATER_CONSUMED_IN_LITERS : ${totalWaterConsumedInLitres}`);
            _logger.warn(`TOTAL_COST : ${totalCost}`);
        }
    }
    else if (!isAllotWater && isBill) {
        _logger.error('Command: ALLOT_WATER not found.');
    }
    else if (!isBill && isAllotWater) {
        _logger.error('Command: BILL not found.');
    }
}
else {
    _logger.error('Invalid File path');
}
//# sourceMappingURL=app.js.map