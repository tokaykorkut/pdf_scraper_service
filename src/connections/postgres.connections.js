import { Sequelize } from "sequelize";
import { postgresLogErr, postgresLogInfo } from "../middlewares/logger.middlewares";

// * Developement
// import dotenv from "dotenv";
// dotenv.config();

export const sequelizeDb = new Sequelize(
    process.env.DATABASE_SERVER, 
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
    dialect: "postgres",

    // * Production
    // host: `/cloudsql/${process.env.DATABASE_SOCKET_PATH}`,

    // * Development and Production in Kubernetes
    host: process.env.DATABASE_HOST,


    logging: msg => postgresLogInfo(msg),
    pool: {
        max: 100,
        min: 0,
        acquire: 3000000,
        idle: 1800000
    }
});

export const databaseConnTest = async() => {
    try {
        await sequelizeDb.authenticate();
        postgresLogInfo('Connection has been established successfully.');
    } catch (error) {
        postgresLogErr(`Unable to connect to the database: ${error}`);
    }
}