import { DataTypes } from "sequelize";
import { sequelizeDb } from "../connections/postgres.connections";

export const BlockTextPartModel = sequelizeDb.define('BlockTextPart',{
    paragraphText:{
        type: DataTypes.STRING,
        allowNull: false
    },
    reportPartTypeId:{
        type: DataTypes.INTEGER
    },
    blockId:{
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