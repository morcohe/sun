import { DataTypes } from "sequelize";
import sequelize from "../index";


type TUser = {
    id?: string,
    name: string,
    email: string,
    password?: string,
    hash?: string,
    phone: string,
    role: "Seeking" | "Marketing" | "Sales" | "Admin" | "SuperAdmin",
    lastActive?: string
}


export const User = sequelize.define('User', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(40),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(40),
        unique: true,
        allowNull: false
    },
    hash: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM("Seeking", "Marketing", "Sales", "Admin", "SuperAdmin"),
        unique: false,
        allowNull: false
    },
    lastActive: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},
    {
        freezeTableName: true,
        tableName: "User",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
);



export default User;