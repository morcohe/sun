import { Model, ModelStatic } from 'sequelize';
import { defaults } from './defaults.config';

//props should be shaped as: { propA: "valueA", propB: "valueB", ... }

/**
 * @description A generic class for model repository. Should be extended for extended features.
 */
class GRepository {


    /**
     * @param {ModelStatic<Model>} model - Sequelize DB model. 
     * @param {string} name - Model name 
     */
    constructor(private model: ModelStatic<Model>, private name: string) { }



    init = async (name: string, model: any) => {
        if (Object.keys(defaults).includes(name)) {
            const modelMetaData = await model.findAndCountAll();
            if (modelMetaData.count === 0 && modelMetaData.rows.length === 0) {
                const data = defaults[name];
                console.log(`>> [DB] Initializing Default ${name}...`);
                const initCreationResult = await this.setMulti(data);
                console.log(`Initial ${name} creation result: `, initCreationResult);
            }
        }
    }


    setOne = async (props: any) => {
        try {
            const res: any = await this.model.create(props);
            return res.dataValues;
        } catch (err) {
            console.error(`[ERROR][${this.name}] Create: `, err);
            throw new Error(err);
        }
    }



    setMulti = async (data: Array<any>) => {
        try {
            const res: any = await this.model.bulkCreate(data);
            return res;
        } catch (err) {
            console.error(`[ERROR][${this.name}] Create Multi: `, err);
            throw new Error(err);
        }
    }



    getOne = async (props: any) => {
        try {
            await this.init(this.name, this.model);
            const whereSTMNT = { raw: true, where: props }
            const instance = await this.model.findOne(whereSTMNT);
            return instance;
        } catch (err) {
            console.error(`[ERROR][${this.name}] findOneBy: `, err);
            throw new Error(err);
        }
    }



    getAll = async (props?: any, groupBy?: string) => {
        try {
            await this.init(this.name, this.model);
            let whereSTMNT: any = { raw: true };
            if (groupBy) {
                if (!props) {
                    whereSTMNT = { ...whereSTMNT, group: ["id", groupBy] };
                } else {
                    whereSTMNT = { ...whereSTMNT, where: props, group: ["id", groupBy] };
                }
            } else {
                if (props) {
                    whereSTMNT = { ...whereSTMNT, where: props };
                }
            }
            const allInstances = await this.model.findAll(whereSTMNT);
            return allInstances;
        } catch (err) {
            console.error(`[ERROR][${this.name}] getAll: `, err);
            return [];
        }
    }



    updateOne = async (who: any, props: any) => {
        try {
            const foundInstance = await this.getOne(who);
            if (foundInstance) {
                await this.removeOne(who);
                try {
                    return await this.setOne({ ...foundInstance, ...props });
                } catch (error) {
                    console.warn(`[Warning][${this.name}] didn't update.`);
                    const old = await this.setOne(foundInstance);   //on failure - restore the old one
                    return old;
                }
            }
        } catch (err) {
            console.error(`[ERROR][${this.name}] updateOne: `, err);
            throw new Error(err);
        }
    }



    removeOne = async (props: any) => {
        try {
            const whereSTMNT = { where: props };
            const res = await this.model.destroy(whereSTMNT);
            return res;
        } catch (err) {
            console.error(`[ERROR][${this.name}] removeOne: `, err);
            throw new Error(err);
        }
    }


    removeAll = async (props: any) => {
        try {
            const whereSTMNT = { where: props };
            const res = await this.model.destroy(whereSTMNT);
            return res;
        } catch (err) {
            console.error(`[ERROR][${this.name}] removeAll: `, err);
            throw new Error(err);
        }
    }


}


export default GRepository;