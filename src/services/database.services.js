import { postgresLogErr, postgresLogWarn } from "../middlewares/logger.middlewares"
import { BlockTextPartModel } from "../models/blockTextPart.models";
import { ImageModel } from "../models/image.models";
import { PdfBlockPartModel } from "../models/pdfBlockPart.models";

export const uploadImageData = async(publicUrl, pdfInfo, pageNumber) => {
    try {
        const imageCheck = await ImageModel.findOne({
            where: {
                pageNumber,
                pdfId: pdfInfo.pdfId,
                pdfImageFile: publicUrl
            }
        });
        if (!imageCheck) {
            await ImageModel.create({
                pageNumber,
                pdfId: pdfInfo.pdfId,
                pdfImageFile: publicUrl
            });
            postgresLogWarn(`${publicUrl} File Created.`);
        }else{
            await ImageModel.update({
                pageNumber,
                pdfId: pdfInfo.pdfId,
                pdfImageFile: publicUrl
            },{
                where: {
                    id: imageCheck?.id
                }
            });
            postgresLogWarn(`${publicUrl} File Updated.`);
        }
    } catch (error) {
        postgresLogErr(error);
        postgresLogErr(`Image ${publicUrl} Not Uploaded.`);
    }
}

export const uploadPdfBlockPartsData = async(dataMap, pdfInfo, pageNumber) => {
    try {
        for await (const [blockSeq, paragraphMap] of dataMap){
            let data = "";
            for await (const [paragraphSeq, paragraph] of paragraphMap){
                if (paragraphSeq === 0) {
                    data = data + paragraph;
                } else {
                    data = data + " " + paragraph;
                }
            }
            const blockCheck = await PdfBlockPartModel.findOne({
                where: {
                    pageNumber,
                    pdfId: pdfInfo.pdfId,
                    articleSeq: blockSeq
                }
            });
            if (!blockCheck) {
                await PdfBlockPartModel.create({
                    pageNumber,
                    pdfId: pdfInfo.pdfId,
                    articleSeq: blockSeq,
                    blockText: data
                });
                postgresLogWarn(`${blockSeq} Block of ${pdfInfo.originalName}.${pageNumber}.png Created.`);
            } else {
                await PdfBlockPartModel.update({
                    pageNumber,
                    pdfId: pdfInfo.pdfId,
                    articleSeq: blockSeq,
                    blockText: data
                },{
                    where: {
                        id: blockCheck?.id
                    }
                });
                postgresLogWarn(`${blockSeq} Block of ${pdfInfo.originalName}.${pageNumber}.png Updated.`);
            }
        }
        postgresLogWarn(`${pdfInfo.originalName}.${pageNumber}.png Blocks Uploaded.`);
    } catch (error) {
        postgresLogErr(error);
        postgresLogErr(`${pdfInfo.originalName}.${pageNumber}.png Blocks Not Uploaded.`);
        return [];
    }
}

export const uploadBlockTextPartsData = async(dataMap, pdfInfo, pageNumber) => {
    try {
        for await (const [blockSeq, paragraphMap] of dataMap){
            const blockCheck = await PdfBlockPartModel.findOne({
                where: {
                    pageNumber,
                    pdfId: pdfInfo.pdfId,
                    articleSeq: blockSeq
                }
            });
            if (blockCheck) {
                for await (const [paragraphSeq, paragraph] of paragraphMap){
                    const paragraphCheck = await BlockTextPartModel.findOne({
                        where: {
                            pageNumber,
                            blockId: blockCheck?.id,
                            articleSeq: paragraphSeq
                        }
                    });
                    if (!paragraphCheck) {
                        await BlockTextPartModel.create({
                            pageNumber,
                            blockId: blockCheck?.id,
                            articleSeq: paragraphSeq,
                            paragraphText: paragraph
                        });
                        postgresLogWarn(`${paragraphSeq} Paragraph of ${pdfInfo.originalName}.${pageNumber}.png Created.`);
                    } else {
                        await BlockTextPartModel.update({
                            pageNumber,
                            blockId: blockCheck?.id,
                            articleSeq: paragraphSeq,
                            paragraphText: paragraph
                        },{
                            where: {
                                id: paragraphCheck?.id
                            }
                        });
                        postgresLogWarn(`${paragraphSeq} Paragraph of ${pdfInfo.originalName}.${pageNumber}.png Updated.`);
                    }
                }
            }
        }
        postgresLogWarn(`${pdfInfo.originalName}.${pageNumber}.png Paragraphs Uploaded.`);
    } catch (error) {
        postgresLogErr(error);
        postgresLogErr(`${pdfInfo.originalName}.${pageNumber}.png Paragraphs Not Uploaded.`);
    }
}