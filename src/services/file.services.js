import { bucketsLogErr, bucketsLogWarn, googleApiLogErr, googleApiLogWarn, postgresLogWarn } from "../middlewares/logger.middlewares";
import { imageStorage, pdfStorage } from "../connections/cloudStorage.connections";
import path from "path";
import { unlink } from "fs/promises";
import { PDFExtract } from "pdf.js-extract";
import * as pdfConverter from "pdf2pic";
import { uploadImageData } from "./database.services";
import { visionApiCallTextExtraction } from "./visionApi.services";

const pdfExtractor = new PDFExtract();

// * Development
// const cwdPdf = path.join(__dirname, "../pdfs/");
// const cwdImage = path.join(__dirname, "../images/");

// * Production
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const cwdPdf = path.join(path.dirname(__filename), "../pdfs/");
const cwdImage = path.join(path.dirname(__filename), "../images/");

// * Developement
// import dotenv from "dotenv";
// dotenv.config();


const uploadImageFile = async(pdfInfo, imageFilesNumber) => {  
    const uploadPath = path.join(cwdImage, `${pdfInfo.originalName}`);
    try {
        for (let index = 1; index < imageFilesNumber+1; index++) {
            await imageStorage.upload(`${uploadPath}.${index}.png`, {
                destination: `${pdfInfo.originalName}.${index}.png`
            });
            const imagePage = path.join(cwdImage, `${pdfInfo.originalName}.${index}.png`);
            const publicUrl = `${process.env.GOOGLE_STORAGE_BASEURL}/${process.env.GOOGLE_IMAGE_STORAGE_BUCKET_NAME}/${pdfInfo.originalName}.${index}.png`;
            await uploadImageData(publicUrl, pdfInfo, index);
            await visionApiCallTextExtraction(imagePage, pdfInfo, index);
            await unlink(imagePage);
        }
        bucketsLogWarn("Image Files Uploaded.");
        await unlink(`${cwdPdf}${pdfInfo.originalName}`);
    } catch (error) {
        bucketsLogErr("Not Uploaded Image File.");
        bucketsLogErr(error);
    }
}

const createImagesOfPdfFile = async(pdfPath, pdfInfo) => {
    const options = {}
    try {
        const result = await pdfExtractor.extract(`${pdfPath}`,options);
        if(!result || !result?.pages || result?.pages.length === 0) {
            googleApiLogErr("Pdf File Empty.")
            return;
        }
        const promises = result.pages.map(async(page)=>{
            const storeAsImage = pdfConverter.fromPath(pdfPath, {
                density: 330,
                saveFilename: pdfInfo.originalName,
                savePath: cwdImage,
                format: "png",
                width: page.pageInfo.width,
                height: page.pageInfo.height
            });
            const data = await storeAsImage(page.pageInfo.num);
            return data;
        });
        await Promise.all(promises);
        googleApiLogWarn("Pdf File Converted To Images.");
        await uploadImageFile(pdfInfo, result?.pages.length);
    } catch (error) {
        googleApiLogErr(error);
        googleApiLogErr("Not Converted Pdf File.");
    }
}

export const downloadPdfFile = async(pdfInfo) => {
    const uploadPath = path.join(cwdPdf, `${pdfInfo.originalName}`);
    const options = {
        destination: uploadPath
    }
    try {
        await pdfStorage.file(pdfInfo.originalName).download(options);
        bucketsLogWarn("Pdf File Downloaded.");
        await createImagesOfPdfFile(uploadPath, pdfInfo);
    } catch (error) {
        bucketsLogErr(error);
        bucketsLogErr("Not Downloaded Pdf File.");
    }
}