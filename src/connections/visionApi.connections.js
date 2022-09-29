import vision from "@google-cloud/vision";
import { base64ToAsciiVisionApiAdmin } from "../utils/helpers";

// * Developement
// import dotenv from "dotenv";
// dotenv.config();

const google_cred = base64ToAsciiVisionApiAdmin();

export const googleVisionApi = new vision.ImageAnnotatorClient({
    credentials:{
        client_email: google_cred.client_email,
        private_key: google_cred.private_key
    },
    projectId: process.env.GOOGLE_PROJECT_ID
});
