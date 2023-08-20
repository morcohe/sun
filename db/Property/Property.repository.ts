import Property from './Property.model';
const { Op } = require('sequelize');



export const create = async (data: any) => {
    try {
        const res = await Property.create(data);
        return res;
    } catch (err) {
        console.error("[ERROR] Create Property: ", err)
        throw new Error(err);
    }
};


export const createMulti = async (data: Array<any>, user: any) => {
    try {
        console.log("REPO MULTI: ", data);
        let tmp = [];
        for await (const item of data){
            tmp.push({
                ...item,
                addedBy: user.id
            })
        }
        const res = await Property.bulkCreate(tmp);
        return res;
    } catch (err) {
        console.error("[ERROR] Create multi properties: ", err)
        throw new Error(err);
    }
};



export const findByPk = async (id: string) => {
    try {
        const property = await Property.findByPk(id);
        return property;
    } catch (err) {
        throw new Error(err)
    }
};





export const findAll = async (filters?: any) => {
    try {
        let tmp: any = [];
        const properties = await Property.findAll({ raw: true, ...filters });
        console.log("FIND ALL Property REPOSITORY QUERY RESULT: ", properties)
        return properties;
    } catch (err) {
        throw new Error(err)
    }
};


export const update = async (id: string, data: any) => {
    try {
        const prop = await Property.findByPk(id);
        await prop?.update(data);
        return prop;
    } catch (err) {
        throw new Error(err);
    }
};



export const remove = async (id: string) => {
    try {
        const res = await Property.destroy({ where: { code: id } });
        return res;
    } catch (err) {
        throw new Error(err);
    }
};
