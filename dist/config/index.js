"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG = void 0;
exports.APP_CONFIG = {
    loggerLevel: 'debug',
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
};
//# sourceMappingURL=index.js.map