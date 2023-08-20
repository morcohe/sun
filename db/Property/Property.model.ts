import { DataTypes } from "sequelize";
import sequelize from "../index";


export const Property = sequelize.define('Property', {
    code: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: false,
        allowNull: false
    },
    condo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    owner: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    phone: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    line: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    provice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    area: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    size: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    floor: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tower: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    priceRent: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pricePostForSale: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    netPrice: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    transferOwnership: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    mark: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    dateForUpdate: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    PropertyHub: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    addedBy: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
    { freezeTableName: true, tableName: "Property" },
);



export default Property;