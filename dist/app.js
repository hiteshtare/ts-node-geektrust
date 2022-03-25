"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const http = require("http");
const express = require("express");
const log4js_1 = require("log4js");
const logger = log4js_1.getLogger();
logger.level = '' + process.env.LOGGER_LEVEL;
let app = express();
const port = process.env.port || process.env.PORT || 3978;
http.createServer(app).listen(port, () => {
  logger.info(`${app.name} listening on ${port}`);
});
//# sourceMappingURL=app.js.map