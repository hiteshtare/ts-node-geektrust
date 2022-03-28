// Import node modules
import { readFileSync } from 'fs';
import { getLogger, Logger } from 'log4js';

// Import custom modules
import { APP_CONFIG } from './../config/index';

// Logger initialise
const _logger = getLoggerLevel();

export function getLoggerLevel(): Logger {
  const logger = getLogger();
  logger.level = APP_CONFIG.loggerLevel;
  return logger;
}

export function getBillBySlabCostPerLitre(litres: number) {
  _logger.debug(`getBillBySlabCostPerLitre for Litres: ${litres}`);

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

export function readInputFile(filePath: string) {
  _logger.debug(`readInputFile for Path: ${filePath}`);

  try {
    const fileData = readFileSync(filePath, 'utf8');

    return {
      isError: false,
      data: fileData
    }
  }
  catch (err) {
    _logger.error(err)
    return {
      isError: true,
      data: undefined
    }
  }
}
