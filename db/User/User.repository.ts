import User from './User.model';
import { uuid as uuid_v4 } from "uuidv4";
import { hashPassword } from '../../src/handleHash';
const { Op } = require('sequelize');
const moment = require('moment');
import { defaults } from '../defaults.config';



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



const init = async () => {
    try {
        if (Object.keys(defaults).includes("User")) {
            const metaData = await User.findAndCountAll();
            if (metaData.count === 0 && metaData.rows.length === 0) {
                const data = defaults["User"];
                console.log(`>> [DB] Initializing Default User...`);
                const initCreationResult = await createMulti(data);
                console.log(`Initial User creation result: `, initCreationResult);
            }
        }
    } catch (err) {
        console.error("[ERROR] init default users: ", err)
    }
}



export const create = async (data: TUser) => {

    await init();

    if (!data.password?.length) {
        throw new Error("Failed to create user: password not supplied.");
    }

    const hash: string = await hashPassword(data.password);

    const user: TUser = {
        id: data.id ? data.id : uuid_v4(),
        name: data.name,
        email: data.email,
        hash: hash,
        phone: data.phone,
        role: data.role
    }

    const found = await findByEmail(data.email);

    if (found) {
        throw new Error("There is already a user with the same Email address");
    }

    try {
        const res = await User.create(user);
        return res;
    } catch (err) {
        console.error("[ERROR] Create user: ", err)
        throw new Error(err);
    }
};



export const createMulti = async (data: Array<TUser>) => {
    try {
        await init();
        let tmp = [];
        for await (const item of data){
            const hash = await hashPassword(`${item.password}`);
            tmp.push({
                id: item.id ? item.id : uuid_v4(),
                name: item.name,
                email: item.email,
                hash: hash,
                phone: item.phone,
                role: item.role
            })
        }
        const res = await User.bulkCreate(tmp);
        return res;
    } catch (err) {
        console.error("[ERROR] Create user: ", err)
        throw new Error(err);
    }
};





export const findByPk = async (uid: string) => {
    try {
        const user = await User.findByPk(uid);
        return user;
    } catch (err) {
        throw new Error(err)
    }
};


export const updateActivity = async (uid: string) => {
    try {
        const user = await User.findByPk(uid);
        console.log("UPDATE ACTIVITY REPOSITORY: ", { ...user, lastActive: moment().add(3, 'hours').format('lll') })
        try {
            await update(uid, { ...user, lastActive: moment().add(3, 'hours').format('lll') });
        } catch (error) {
            console.log("UPDATE ACTIVITY REPOSITORY ERROR: ", error);
        }

        return user;
    } catch (err) {
        throw new Error(err)
    }
}



export const findAll = async () => {

    try {
        let tmp: any = [];
        const usrs = await User.findAll({ raw: true });
        usrs.map((itm: any, indx: number) => {
            tmp.push({
                uid: itm.id,
                name: itm.name,
                email: itm.email,
                phone: itm.phone,
                role: itm.role
            })
        })
        console.log("FIND ALL USERS REPOSITORY QUERY RESULT: ", tmp)
        return tmp;
    } catch (err) {
        throw new Error(err)
    }
};



export const findByEmail = async (email: string) => {
    try {
        const usr: any = await User.findOne({ where: { email: email } });
        if (usr?.dataValues) {
            return usr.dataValues;
        } else {
            return null;
        }
    } catch (err) {
        console.log("[Error] while trying to find user by email: ", err);
        return null;
    }
};



export const findAllBy = async (customers: { isCustomers: boolean, customers: Array<string> }, isTeam: boolean) => {
    try {

        let users: Array<any> = [];

        const allUsers: Array<any> = await User.findAll({ raw: true });

        const TEAM = ["Team", "Admin", "Manager"];

        for await (const usr of allUsers) {

            //team users
            if (isTeam && TEAM.includes(usr.role)) {
                users.push(usr);
            }

            //customer users (if the user is not team user then he is customer)
            else if (customers.isCustomers) {

                //in case we get a specific list of customers (companies)
                //add only the users of the specific companies
                if (customers.customers.length) {
                    if (customers.customers.includes(usr.company)) {
                        users.push(usr);
                    }
                }

                //in case we DO NOT get a specific list of customers (companies)
                //add any customer user
                else {
                    users.push(usr);
                }
            }

        }

        return users;

        // //retreive team users
        // if (isTeam) {

        //     let teamFilters = [];

        //     const TEAM_FILTER = {
        //         [Op.or]: [
        //             { role: 'Team' },
        //             { role: 'Admin' },
        //             { role: 'Manager' }
        //         ]
        //     };

        //     teamFilters.push(TEAM_FILTER);
        //     const tmpUsers = await User.findAll({ raw: true, where: { [Op.and]: teamFilters } });
        //     users = [...users, ...tmpUsers];
        // }

        // //retreive customers
        // if (customers.isCustomers) {

        //     let customerFilters: Array<any> = [];

        //     const CUSTOMERS_FILTER = {
        //         [Op.or]: [
        //             { role: 'Customer' },
        //             { role: 'CustomerManager' },
        //             { role: 'CustomerPlus' },
        //             { role: 'LimitedCustomerManager' }
        //         ]
        //     };

        //     //filter customers by list of companies
        //     if (customers.customers.length) {
        //         const customersRegexp = customers.customers.join("|");
        //         const tmpUsers = await User.findAll({ raw: true, where: { company: { [Op.regexp]: customersRegexp } } });
        //         users = [...users, ...tmpUsers];
        //     } 

        //     //filter all customers
        //     else {
        //         customerFilters.push(CUSTOMERS_FILTER);
        //         const tmpUsers = await User.findAll({ raw: true, where: { [Op.and]: customerFilters } });
        //         users = [...users, ...tmpUsers];
        //     }
        // }

        // return users;

    } catch (err) {
        throw new Error(err)
    }
};







export const update = async (uid: string, data: any) => {
    try {
        const user = await User.findByPk(uid);
        await user?.update(data);
        return user;
    } catch (err) {
        throw new Error(err);
    }
};



export const remove = async (uid: string) => {
    try {
        const res = await User.destroy({ where: { id: uid } });
        return res;
    } catch (err) {
        throw new Error(err);
    }
};
