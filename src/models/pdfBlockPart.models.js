import { DataTypes } from "sequelize";
import { sequelizeDb } from "../connections/postgres.connections";

export const PdfBlockPartModel = sequelizeDb.define('PdfBlockPart',{
    blockText:{
        type: DataTypes.STRING,
        allowNull: false
    },
    reportPartTypeId:{
        type: DataTypes.INTEGER
    },
    pdfId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    articleSeq:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semanticTypeId:{
        type: DataTypes.INTEGER
    },
    pageNumber:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: true
});