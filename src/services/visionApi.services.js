import path from "path";
import { googleVisionApi } from "../connections/visionApi.connections";
import { uploadBlockTextPartsData, uploadPdfBlockPartsData } from "./database.services";
import { googleApiLogErr, googleApiLogWarn } from "../middlewares/logger.middlewares";

// * Development
// const cwdImage = path.join(__dirname, "../images/");

// * Production
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const cwdImage = path.join(path.dirname(__filename), "../images/");

// * Developement
// import dotenv from "dotenv";
// dotenv.config();


export const visionApiCallTextExtraction = async(imagePage, pdfInfo, pageNumber) => {
    const blockPartsMap = new Map();
    try {
        const [result] = await googleVisionApi.textDetection(imagePage);
        result?.fullTextAnnotation?.pages[0]?.blocks.map((block, indexBlock)=>{   
            const paragraphPartsMap = new Map();
            block.paragraphs.map((paragraph, indexParagraph)=>{
                let paragraphParts = "";
                paragraph.words.map((word, indexWord)=>{
                    let wordParts = "";
                    word.symbols.map((symbol)=>{
                        wordParts = wordParts + symbol.text;
                    });
                    if (indexWord === 0) {
                        paragraphParts = wordParts;
                    } else {
                        paragraphParts = paragraphParts + " " + wordParts;
                    }
                });
                paragraphPartsMap.set(indexParagraph, paragraphParts);
            });
            blockPartsMap.set(indexBlock, paragraphPartsMap);
        });
        await uploadPdfBlockPartsData(blockPartsMap, pdfInfo, pageNumber);
        await uploadBlockTextPartsData(blockPartsMap, pdfInfo, pageNumber)
        googleApiLogWarn(`Text of ${pdfInfo.originalName}.${pageNumber}.png Extracted.`);
    } catch (error) {
        googleApiLogErr(error);
        googleApiLogErr(`Text of ${pdfInfo.originalName}.${pageNumber}.png Not Extracted.`);
    }
}