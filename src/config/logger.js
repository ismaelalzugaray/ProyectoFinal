import config from "./config.js";
import winston from "winston";

//CUSTOM FORMAT
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${message || stack}`;
  }
);

//CUSTOM LEVELS AND COLOURS
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red bold",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "cyan",
  },
};

//DEVELOPMENT LOGGER
const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.errors({ stacks: true }),
        logFormat
      ),
    }),
  ],
});

//PRODUCTION LOGGER
const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.errors({ stacks: true }),
        logFormat
      ),
    }),

    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.errors({ stacks: true }),
        logFormat
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (config.environment === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  next();
};
