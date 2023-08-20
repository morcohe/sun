import { DataTypes } from "sequelize";
import sequelize from "../index";


export const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    page: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    columns: {
        type: DataTypes.JSON,
        unique: false,
        allowNull: false,
        defaultValue: []
    },
    read: {
        type: DataTypes.JSON,
        unique: false,
        allowNull: false,
        defaultValue: ["Own"]
    },
    write: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false,
        defaultValue: false
    },
    edit: {
        type: DataTypes.JSON,
        unique: false,
        allowNull: false,
        defaultValue: []
    },
    delete: {
        type: DataTypes.JSON,
        unique: false,
        allowNull: false,
        defaultValue: []
    },
    import: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false,
        defaultValue: false
    },
    export: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false,
        defaultValue: false
    },
    assign: {
        type: DataTypes.JSON,
        unique: false,
        allowNull: false,
        defaultValue: []
    },
    search: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false,
        defaultValue: false
    },
},
{
    freezeTableName: true,
    tableName: "Role",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
},
);


export default Role;