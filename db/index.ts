import { Sequelize } from "sequelize";


const sequelize = new Sequelize(`${process.env.PSQL_CONNECTION_LINK}`, { logging: true });


const initConnection = () => {
    sequelize.sync();
    sequelize.authenticate().then(async (res: any) => {
        console.log('>> [DB] Connection has been established successfully.');
    }).catch(async (error: Error) => {
        console.error('>> [DB] Error: ', error);
    })
}


initConnection();


export default sequelize;