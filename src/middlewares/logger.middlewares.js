import winston from "winston";
const { transports, format, createLogger } = winston;
const { combine, colorize, simple, timestamp } = format; 

const loggerCreation = createLogger({
    format: combine(
        timestamp(),
        colorize({all: true}),
        simple()
    ),
    transports: [
        new transports.Console()
    ]
});

const logger = {
    http: loggerCreation,
    postgres: loggerCreation,
    buckets: loggerCreation,
    googleApi: loggerCreation,
    rabbitMq: loggerCreation
}

export const googleApiLogInfo = ((message) => {
    logger.postgres.info(`GoogleApi Information: ${message}`);
});

export const googleApiLogWarn = ((message) => {
    logger.postgres.warn(`GoogleApi Call: ${message}`);
});

export const googleApiLogErr = ((message) => {
    logger.postgres.error(`GoogleApi Error: ${message}`);
});

export const bucketsLogInfo = ((message) => {
    logger.postgres.info(`Buckets Information: ${message}`);
});

export const bucketsLogWarn = ((message) => {
    logger.postgres.warn(`Buckets Call: ${message}`);
});

export const bucketsLogErr = ((message) => {
    logger.postgres.error(`Buckets Error: ${message}`);
});

export const postgresLogInfo = ((message) => {
    logger.postgres.info(`Database Information: ${message}`);
});

export const postgresLogWarn = ((message) => {
    logger.postgres.warn(`Database Call: ${message}`);
});

export const postgresLogErr = ((message) => {
    logger.postgres.error(`Database Error: ${message}`);
});

export const httpLogInfo = ((message) => {
    logger.http.info(`HTTP Information: ${message}`);
});

export const httpLogWarn = ((message) => {
    logger.http.warn(`HTTP Call: ${message}`);
});

export const httpLogErr = ((message) => {
    logger.http.error(`HTTP Error: ${message}`);
});

export const rabbitMqLogInfo = ((message) => {
    logger.rabbitMq.info(`RabbitMq Information: ${message}`);
});

export const rabbitMqLogWarn = ((message) => {
    logger.rabbitMq.warn(`RabbitMq Call: ${message}`);
});

export const rabbitMqLogErr = ((message) => {
    logger.rabbitMq.error(`RabbitMq Error: ${message}`);
});