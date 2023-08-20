import { DataTypes } from "sequelize";
import sequelize from "../index";


export const Record = sequelize.define('Record', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    page: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    assignedUsers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
},
    {
        freezeTableName: true,
        tableName: "Record",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
);


Record.beforeCreate(async (record: any, options: any) => {
    const tmp = record.dataValues[0];
    const allSameCode = await Record.findAll({ where: tmp });
    return record;
});


export default Record;