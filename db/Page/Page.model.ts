import { DataTypes } from "sequelize";
import sequelize from "../index";
import Role from "../Role/Role.model";
import GRepository from '../GenericCRUD.service';

/**
 * Page model represents a data table of page
 */

export const Page = sequelize.define('Page', {
    id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    column: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("Select", "Boolean", "Text", "Tag"),
        unique: false,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
},
    {
        freezeTableName: true,
        tableName: "Page",
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
);

Page.afterCreate(async (page: any, options: any) => {

    const roleList = ["SuperAdmin", "Admin", "Marketing", "Seeking", "Sales"];
    const roleRepo = new GRepository(Role, "Role");
    await roleRepo.init("Role",Role);
    for await (const role of roleList) {
        const isExist = await Role.findOne({ where: { page: page?.dataValues?.name, name: role } });
        if(!isExist){
            const createResult = await Role.create({
                id: `${page?.dataValues?.name}-${role}`,
                name: role,
                page: page?.dataValues?.name,
                columns: [],
                read: [],
                write: false,
                edit: [],
                delete: [],
                import: false,
                export: false,
                assign: [],
                search: false
            });
            console.log("After Page creation | hook result: ", createResult);
        }
    }
});

export default Page;