import * as Sequelize from 'sequelize';
// import * as dotenv from 'dotenv';

export class Database {
    public sequelize: Sequelize.Sequelize;

    constructor() {
        let db;
        const user = process.env.MYSQL_USER;
        const pwrd = process.env.MYSQL_PWRD;
        const host = process.env.MYSQL_HOST;
        if (process.env.NODE_ENV === 'dev') {
            db = process.env.MYSQL_TEST;
        } else {
            db =  process.env.MYSQL_PROD;
        }

        this.sequelize = new Sequelize(db, user, pwrd, {
            host: host,
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });

        this.sequelize.authenticate()
        .then(() => {
          console.log('Connection to database has been established successfully.');
        })
        .catch(err => {
          console.error('Unable to connect to the database:', err);
        });
    }

}

export default new Database();

