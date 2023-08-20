import { DataTypes } from "sequelize";
import sequelize from "../index";


export const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    moveIn: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    moveOut: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rentalPeriod: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rentPrice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sellPrice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ageTanant: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    phone: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nameOwner: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nameCondo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    noRoom: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    presentBy: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tm30: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contractSing: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    furnsihedList: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    draftContract: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    advertFrom: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    
},
    { freezeTableName: true, tableName: "Contract" },
);



export default Contract;