"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInputFile = exports.getBillBySlabCostPerLitre = exports.getLoggerLevel = void 0;
const fs_1 = require("fs");
const log4js_1 = require("log4js");
const index_1 = require("./../config/index");
const _logger = getLoggerLevel();
function getLoggerLevel() {
    const logger = (0, log4js_1.getLogger)();
    logger.level = index_1.APP_CONFIG.loggerLevel;
    return logger;
}
exports.getLoggerLevel = getLoggerLevel;
function getBillBySlabCostPerLitre(litres) {
    _logger.debug(`getBillBySlabCostPerLitre for Litres: ${litres}`);
    let bill = 0;
    let prevSlabLimit = 0;
    index_1.APP_CONFIG.arrSlabRates.forEach((slab) => {
        let slabDiff = slab.slabLimit - prevSlabLimit;
        let slabRate = slab.costPetLitres;
        if (litres > slabDiff) {
            litres -= slabDiff;
            bill += slabDiff * slabRate;
        }
        else {
            bill += litres * slabRate;
            litres = 0;
        }
        prevSlabLimit = slab.slabLimit;
    });
    return bill;
}
exports.getBillBySlabCostPerLitre = getBillBySlabCostPerLitre;
function readInputFile(filePath) {
    _logger.debug(`readInputFile for Path: ${filePath}`);
    try {
        const fileData = (0, fs_1.readFileSync)(filePath, 'utf8');
        return {
            isError: false,
            data: fileData
        };
    }
    catch (err) {
        _logger.error(err);
        return {
            isError: true,
            data: undefined
        };
    }
}
exports.readInputFile = readInputFile;
//# sourceMappingURL=common.util.js.map