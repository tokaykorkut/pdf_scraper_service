import { databaseConnTest } from "./connections/postgres.connections";
import { cloudStorageConnTest } from "./connections/cloudStorage.connections";
import { rabbitConnection } from "./connections/rabbitmq.connections";

// * Developement
// import dotenv from "dotenv";
// dotenv.config();

cloudStorageConnTest();
databaseConnTest();
rabbitConnection();