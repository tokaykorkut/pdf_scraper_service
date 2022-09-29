// * Developement
// import dotenv from "dotenv";
// dotenv.config();

export const base64ToAsciiStorageAdmin = () => {
    return JSON.parse(Buffer.from(process.env.GOOGLE_STORAGE_SERVICE_ACCOUNT_KEY,"base64").toString("ascii"));
}

export const base64ToAsciiVisionApiAdmin = () => {
    return JSON.parse(Buffer.from(process.env.GOOGLE_VISION_API_SERVICE_ACCOUNT_KEY,"base64").toString("ascii"));
}