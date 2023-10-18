import { Sequelize } from "sequelize";


const getConLink = () => `postgresql://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}/${process.env.PSQL_SERVER}`;


const sequelize = new Sequelize(getConLink(), { logging: true });


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