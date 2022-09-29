import amqplib from "amqplib";
import { rabbitMqLogErr, rabbitMqLogInfo, rabbitMqLogWarn } from "../middlewares/logger.middlewares";
import { downloadPdfFile } from "../services/file.services";

// * Development
// import dotenv from "dotenv";
// dotenv.config();

// * Development
// const amqplibUrl = "amqp://localhost:5672";
// const queueName = "pdfScraperService";
// const exchangeName = "globalSplitter";
// const bindingKey = "pdfScraper";
// const exchangeType = "direct";

// * Production
const amqplibUrl = process.env.RABBITMQ_URL;
const queueName = process.env.RABBITMQ_QUEUE_NAME;
const exchangeName = process.env.RABBITMQ_EXCHANGE_NAME;
const bindingKey = process.env.RABBITMQ_BINDING_KEY;
const exchangeType = process.env.RABBITMQ_EXCHANGE_TYPE;

export const processMessage = async(message) => {
    try {
        await downloadPdfFile(message);
    } catch (error) {
        rabbitMqLogErr(error);
        rabbitMqLogErr("Pdf_Scraper Queue Got Error");
    }
}

export const rabbitConnection = async() => {
    try {
        const connection = await amqplib.connect(amqplibUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, exchangeType, {durable: true});
        await channel.assertQueue(queueName);
        await channel.bindQueue(queueName, exchangeName, bindingKey);
        rabbitMqLogInfo(`Waiting Message In ${queueName} Queue`);
        channel.consume(queueName, async(message)=>{
            rabbitMqLogWarn(`${queueName} Queue Got Message => ${message.content.toString()}`);
            const pdfInfo = JSON.parse(message.content.toString());
            pdfInfo.pdfId = pdfInfo.pdfId*1;
            await processMessage(pdfInfo);
            channel.ack(message);
        });
    } catch (error) {
        rabbitMqLogErr(error);
        rabbitMqLogErr("Pdf_Scraper Queue Got Error");
    }
}