import { Storage } from "@google-cloud/storage";
import { base64ToAsciiStorageAdmin } from "../utils/helpers";
import { bucketsLogErr, bucketsLogInfo } from "../middlewares/logger.middlewares";

// * Developement
// import dotenv from "dotenv";
// dotenv.config();

const google_cred = base64ToAsciiStorageAdmin();

const googleStorageApi = new Storage({
    credentials:{
        client_email: google_cred.client_email,
        private_key: google_cred.private_key
    },
    projectId: process.env.GOOGLE_PROJECT_ID
});

export const pdfStorage = googleStorageApi.bucket(process.env.GOOGLE_PDF_STORAGE_BUCKET_NAME);
export const imageStorage = googleStorageApi.bucket(process.env.GOOGLE_IMAGE_STORAGE_BUCKET_NAME);

export const cloudStorageConnTest = () => {
    if (pdfStorage) {
        bucketsLogInfo(`Connected to Pdf Storage.`);
    } else {
        bucketsLogErr(`No Connection to Pdf Storage.`);
    }

    if (imageStorage) {
        bucketsLogInfo(`Connected to Image Storage.`);
    } else {
        bucketsLogErr(`No Connection to Image Storage.`);
    }
}