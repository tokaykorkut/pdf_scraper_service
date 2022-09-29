import { DataTypes } from "sequelize";
import { sequelizeDb } from "../connections/postgres.connections";

export const ImageModel = sequelizeDb.define('Image',{
    pdfImageFile:{
        type: DataTypes.STRING,
        allowNull: false
    },
    pdfId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pageNumber:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: true
});