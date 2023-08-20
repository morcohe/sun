import Contract from './Contract.model';
const { Op } = require('sequelize');
import { uuid as uuid_v4 } from "uuidv4";


export const create = async (data: any) => {
    try {
        const res = await Contract.create({
            id: uuid_v4(),
            ...data
        });
        return res;
    } catch (err) {
        console.error("[ERROR] Create Contract: ", err)
        throw new Error(err);
    }
};


export const createMulti = async (data: Array<any>) => {
    try {
        let tmp = [];
        for await (const item of data){
            tmp.push({
                id: uuid_v4(),
                ...item
            })
        }
        const res = await Contract.bulkCreate(tmp);
        return res;
    } catch (err) {
        console.error("[ERROR] Create multi Contracts: ", err)
        throw new Error(err);
    }
};



export const findByPk = async (id: string) => {
    try {
        const contract = await Contract.findByPk(id);
        return contract;
    } catch (err) {
        throw new Error(err)
    }
};





export const findAll = async () => {
    try {
        const contracts = await Contract.findAll({ raw: true });
        console.log("FIND ALL Contract REPOSITORY QUERY RESULT: ", contracts)
        return contracts;
    } catch (err) {
        throw new Error(err)
    }
};


export const update = async (id: string, data: any) => {
    try {
        const contract = await Contract.findByPk(id);
        await contract?.update(data);
        return contract;
    } catch (err) {
        throw new Error(err);
    }
};



export const remove = async (id: string) => {
    try {
        const res = await Contract.destroy({ where: { code: id } });
        return res;
    } catch (err) {
        throw new Error(err);
    }
};
