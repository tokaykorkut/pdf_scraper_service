import { DataTypes } from "sequelize";
import { sequelizeDb } from "../connections/postgres.connections";

export const PdfModel = sequelizeDb.define('Pdf',{
    pdfFile:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pdfFileName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    startupId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    topicId1:{
        type: DataTypes.INTEGER
    },
    topicId2:{
        type: DataTypes.INTEGER
    },
    topicId3:{
        type: DataTypes.INTEGER
    },
    eventCode:{
        type: DataTypes.STRING
    }
},{
    timestamps: true
});